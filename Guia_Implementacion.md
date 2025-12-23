# GUÍA DE IMPLEMENTACIÓN PRÁCTICA
## Roadmap Técnico para Adopción de IA en Geociencias

---

## FASE 1: EVALUACIÓN Y PREPARACIÓN (2-4 semanas)

### 1.1 Inventario de Datos Existentes

**Hidrogeología**:
- [ ] Series históricas de niveles freáticos (mínimo 2-3 años para estacionalidad)
- [ ] Datos de calidad de agua (parámetros fisicoquímicos)
- [ ] Registros de precipitación y evapotranspiración
- [ ] Coordenadas y características constructivas de pozos
- [ ] Mapas hidrogeológicos y perfiles litológicos

**Minería**:
- [ ] Bases de datos de perforación (assays, collar/survey/assay tables)
- [ ] Datos geofísicos (magnetometría, gravimetría, EM)
- [ ] Imágenes de testigos de sondaje
- [ ] Mapas geológicos de superficie
- [ ] Datos MWD si disponibles

### 1.2 Evaluación de Calidad de Datos

**Checklist crítico**:
```python
# Mínimos requeridos para proyectos piloto

HIDROGEOLOGÍA:
- Frecuencia temporal: Mensual o superior
- Pozos monitoreados: ≥10 para modelos locales, ≥50 para regionales
- Missing data: <20% tolerado (imputación posible)
- Parámetros críticos: Nivel freático + ≥2 drivers (precipitación, extracción)

MINERÍA:
- Sondajes: ≥50 para modelos de leyes, ≥100 para litología
- Densidad espacial: Variable según complejidad geológica
- Missing assays: <15% en intervalos críticos
- Imágenes de cores: Resolución mínima 300 DPI para CV
```

### 1.3 Infraestructura Tecnológica Requerida

**Hardware mínimo**:
- Workstation: CPU 8+ cores, 32GB RAM (hidrogeología, minería básica)
- GPU: NVIDIA RTX 3060 (12GB VRAM) para CNNs en análisis de imágenes
- Storage: 500GB SSD para datasets y modelos

**Software open-source**:
```bash
# Stack Python recomendado
conda create -n geocience_ai python=3.10
conda activate geocience_ai

# Core ML/DL
pip install scikit-learn==1.3.0
pip install xgboost==2.0.0
pip install tensorflow==2.14.0  # o pytorch==2.1.0
pip install lightgbm==4.1.0

# Geociencias
pip install flopy  # MODFLOW integration
pip install geopandas rasterio shapely
pip install pyvista  # 3D visualization

# Interpretabilidad
pip install shap lime

# Utilities
pip install pandas numpy matplotlib seaborn plotly
```

---

## FASE 2: PROYECTO PILOTO (1-3 meses)

### 2.1 Caso de Uso Starter: Hidrogeología

**Objetivo**: Predicción de niveles freáticos a 3 meses

**Pipeline técnico**:
```python
# 1. Preprocesamiento
import pandas as pd
from sklearn.preprocessing import StandardScaler

# Cargar datos
data = pd.read_csv('groundwater_monitoring.csv', parse_dates=['date'])

# Feature engineering
data['month'] = data['date'].dt.month
data['year'] = data['date'].dt.year
data['precip_lag1'] = data['precipitation'].shift(1)
data['precip_lag3'] = data['precipitation'].shift(3)
data['level_lag1'] = data['water_level'].shift(1)

# Train/test split temporal
train = data[data['year'] < 2023]
test = data[data['year'] >= 2023]

# 2. Modelo baseline: Random Forest
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

features = ['precipitation', 'precip_lag1', 'precip_lag3', 
            'level_lag1', 'month', 'extraction_rate']
            
rf_model = RandomForestRegressor(n_estimators=200, max_depth=15, 
                                  random_state=42, n_jobs=-1)
rf_model.fit(train[features], train['water_level'])

predictions_rf = rf_model.predict(test[features])
print(f"RF MAE: {mean_absolute_error(test['water_level'], predictions_rf):.2f} m")
print(f"RF R²: {r2_score(test['water_level'], predictions_rf):.3f}")

# 3. Modelo avanzado: LSTM
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

# Preparar secuencias
def create_sequences(data, n_steps=12):
    X, y = [], []
    for i in range(len(data) - n_steps):
        X.append(data[i:i+n_steps])
        y.append(data[i+n_steps])
    return np.array(X), np.array(y)

scaler = StandardScaler()
train_scaled = scaler.fit_transform(train[features])
test_scaled = scaler.transform(test[features])

X_train, y_train = create_sequences(train_scaled, n_steps=12)
X_test, y_test = create_sequences(test_scaled, n_steps=12)

# Arquitectura LSTM
lstm_model = Sequential([
    LSTM(64, activation='relu', return_sequences=True, input_shape=(12, len(features))),
    Dropout(0.2),
    LSTM(32, activation='relu'),
    Dropout(0.2),
    Dense(16, activation='relu'),
    Dense(1)
])

lstm_model.compile(optimizer='adam', loss='mse', metrics=['mae'])
history = lstm_model.fit(X_train, y_train, epochs=50, batch_size=32, 
                         validation_split=0.2, verbose=1)

predictions_lstm = lstm_model.predict(X_test)
print(f"LSTM MAE: {mean_absolute_error(y_test, predictions_lstm):.2f} m")

# 4. Interpretabilidad con SHAP
import shap
explainer = shap.TreeExplainer(rf_model)
shap_values = explainer.shap_values(test[features])
shap.summary_plot(shap_values, test[features], plot_type="bar")
```

**KPIs de éxito**:
- MAE < 0.5m para acuíferos estables
- R² > 0.80
- Superioridad vs baseline persistente (+20% reducción MAE)

---

### 2.2 Caso de Uso Starter: Minería

**Objetivo**: Predicción de leyes de Cu desde datos de perforación

**Pipeline técnico**:
```python
# 1. Cargar datos de drill holes
import pandas as pd

collar = pd.read_csv('collar.csv')  # x, y, z, hole_id
survey = pd.read_csv('survey.csv')  # hole_id, depth, azimuth, dip
assay = pd.read_csv('assay.csv')    # hole_id, from, to, Cu_pct, Au_ppm

# Compositar a intervalos regulares (ej. 2m)
from scipy.interpolate import interp1d

def composite_assays(assay_df, interval=2.0):
    composites = []
    for hole_id in assay_df['hole_id'].unique():
        hole_data = assay_df[assay_df['hole_id'] == hole_id].sort_values('from')
        max_depth = hole_data['to'].max()
        
        for depth in np.arange(0, max_depth, interval):
            # Weighted average en intervalo
            mask = (hole_data['from'] <= depth + interval) & (hole_data['to'] >= depth)
            if mask.any():
                cu_avg = hole_data.loc[mask, 'Cu_pct'].mean()
                composites.append({'hole_id': hole_id, 'depth': depth, 'Cu_pct': cu_avg})
    
    return pd.DataFrame(composites)

composites = composite_assays(assay)

# Merge con coordenadas
data = composites.merge(collar[['hole_id', 'x', 'y', 'z']], on='hole_id')

# 2. Feature engineering espacial
from sklearn.neighbors import NearestNeighbors

# Distancia a pozos de alta ley
high_grade = data[data['Cu_pct'] > data['Cu_pct'].quantile(0.75)]
nn = NearestNeighbors(n_neighbors=3)
nn.fit(high_grade[['x', 'y', 'z']])
distances, _ = nn.kneighbors(data[['x', 'y', 'z']])
data['dist_to_highgrade'] = distances.mean(axis=1)

# 3. Modelo XGBoost
import xgboost as xgb
from sklearn.model_selection import train_test_split

features = ['x', 'y', 'z', 'depth', 'dist_to_highgrade']
X = data[features]
y = data['Cu_pct']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

xgb_model = xgb.XGBRegressor(
    n_estimators=300,
    max_depth=8,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

xgb_model.fit(X_train, y_train, 
              eval_set=[(X_test, y_test)],
              early_stopping_rounds=20,
              verbose=10)

predictions = xgb_model.predict(X_test)

from sklearn.metrics import mean_absolute_error, r2_score
print(f"XGBoost MAE: {mean_absolute_error(y_test, predictions):.4f} %Cu")
print(f"XGBoost R²: {r2_score(y_test, predictions):.3f}")

# 4. Feature importance
import matplotlib.pyplot as plt
xgb.plot_importance(xgb_model, max_num_features=10, importance_type='gain')
plt.tight_layout()
plt.savefig('feature_importance.png', dpi=300)

# 5. Validación cruzada espacial (crítico en minería)
from sklearn.model_selection import KFold

# Agrupar por coordenadas para evitar data leakage espacial
data['spatial_block'] = (data['x'] // 100).astype(str) + '_' + (data['y'] // 100).astype(str)
cv_results = []

for train_blocks, test_blocks in KFold(n_splits=5, shuffle=True).split(data['spatial_block'].unique()):
    train_mask = data['spatial_block'].isin(data['spatial_block'].unique()[train_blocks])
    test_mask = data['spatial_block'].isin(data['spatial_block'].unique()[test_blocks])
    
    xgb_temp = xgb.XGBRegressor(n_estimators=200, max_depth=6, learning_rate=0.05)
    xgb_temp.fit(X[train_mask], y[train_mask])
    pred = xgb_temp.predict(X[test_mask])
    
    mae = mean_absolute_error(y[test_mask], pred)
    cv_results.append(mae)

print(f"Spatial CV MAE: {np.mean(cv_results):.4f} ± {np.std(cv_results):.4f} %Cu")
```

**KPIs de éxito**:
- MAE < 15% de media de leyes
- R² > 0.70 (geología compleja), > 0.85 (geología simple)
- Validación cruzada espacial consistente (std < 20% de media)

---

## FASE 3: INTEGRACIÓN OPERACIONAL (3-6 meses)

### 3.1 Desarrollo de API para Inferencia

**FastAPI ejemplo (hidrogeología)**:
```python
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="Groundwater Level Prediction API")

# Cargar modelo entrenado
model = joblib.load('models/gwl_rf_model.pkl')
scaler = joblib.load('models/gwl_scaler.pkl')

class PredictionInput(BaseModel):
    precipitation: float
    precipitation_lag1: float
    precipitation_lag3: float
    level_lag1: float
    month: int
    extraction_rate: float

@app.post("/predict")
def predict_water_level(input_data: PredictionInput):
    features = np.array([[
        input_data.precipitation,
        input_data.precipitation_lag1,
        input_data.precipitation_lag3,
        input_data.level_lag1,
        input_data.month,
        input_data.extraction_rate
    ]])
    
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]
    
    return {
        "predicted_water_level_m": round(prediction, 2),
        "model_version": "v1.2",
        "confidence": "high" if abs(prediction - input_data.level_lag1) < 1.0 else "medium"
    }

# Ejecutar: uvicorn api:app --host 0.0.0.0 --port 8000
```

### 3.2 Dashboard de Monitoreo con Streamlit

```python
import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Groundwater AI Monitor", layout="wide")

st.title("🌊 Sistema de Predicción de Niveles Freáticos")

# Cargar predicciones
@st.cache_data
def load_data():
    return pd.read_csv('predictions_history.csv', parse_dates=['date'])

data = load_data()

# Métricas principales
col1, col2, col3 = st.columns(3)
with col1:
    st.metric("MAE Último Mes", "0.32 m", "-0.05 m")
with col2:
    st.metric("R² Score", "0.87", "+0.02")
with col3:
    st.metric("Pozos Monitoreados", "24", "+2")

# Gráfico interactivo
fig = px.line(data, x='date', y=['observed', 'predicted'], 
              title='Niveles Observados vs Predichos',
              labels={'value': 'Nivel Freático (m)', 'date': 'Fecha'})
st.plotly_chart(fig, use_container_width=True)

# Feature importance
st.subheader("Importancia de Variables")
importance_data = pd.DataFrame({
    'Variable': ['Nivel t-1', 'Precipitación t-1', 'Extracción', 'Precipitación t-3', 'Mes'],
    'Importancia': [0.45, 0.25, 0.15, 0.10, 0.05]
})
fig_imp = px.bar(importance_data, x='Importancia', y='Variable', orientation='h')
st.plotly_chart(fig_imp, use_container_width=True)
```

### 3.3 Workflow MLOps

**Versionado de modelos con MLflow**:
```python
import mlflow
import mlflow.sklearn

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("groundwater_prediction")

with mlflow.start_run(run_name="RF_v1.3"):
    # Parámetros
    params = {
        "n_estimators": 200,
        "max_depth": 15,
        "min_samples_split": 5
    }
    mlflow.log_params(params)
    
    # Entrenar modelo
    model = RandomForestRegressor(**params)
    model.fit(X_train, y_train)
    
    # Métricas
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    mlflow.log_metric("mae", mae)
    mlflow.log_metric("r2", r2)
    
    # Guardar modelo
    mlflow.sklearn.log_model(model, "model")
    
    # Artifacts
    fig, ax = plt.subplots()
    ax.scatter(y_test, predictions, alpha=0.5)
    ax.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
    plt.savefig("predictions_plot.png")
    mlflow.log_artifact("predictions_plot.png")
```

---

## FASE 4: MANTENIMIENTO Y MEJORA CONTINUA

### 4.1 Monitoreo de Model Drift

```python
from evidently import ColumnMapping
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

# Detectar data drift mensual
reference_data = data[data['year'] == 2022]  # Datos de entrenamiento
current_data = data[data['year'] == 2024]    # Datos actuales

report = Report(metrics=[DataDriftPreset()])
report.run(reference_data=reference_data, current_data=current_data)
report.save_html("drift_report.html")

# Alerta automática si drift detectado
if report.as_dict()['metrics'][0]['result']['dataset_drift']:
    print("⚠️ ALERTA: Data drift detectado. Reentrenamiento recomendado.")
```

### 4.2 Reentrenamiento Automático

```python
import schedule
import time

def retrain_pipeline():
    # 1. Cargar nuevos datos
    new_data = fetch_latest_data()
    
    # 2. Validar calidad
    if validate_data_quality(new_data):
        # 3. Reentrenar
        model_new = train_model(new_data)
        
        # 4. Validar performance
        if evaluate_model(model_new) > current_model_performance:
            deploy_model(model_new)
            notify_team("Modelo actualizado exitosamente")
        else:
            notify_team("Nuevo modelo no supera baseline. Revisión manual requerida.")

# Ejecutar cada domingo a las 2 AM
schedule.every().sunday.at("02:00").do(retrain_pipeline)

while True:
    schedule.run_pending()
    time.sleep(3600)
```

---

## ESCALAMIENTO A PRODUCCIÓN

### Cloud Deployment (AWS ejemplo)

```bash
# 1. Containerizar aplicación
# Dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]

# 2. Build y push
docker build -t gwl-prediction:latest .
docker tag gwl-prediction:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/gwl-prediction:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/gwl-prediction:latest

# 3. Deploy en ECS/Fargate
aws ecs create-service \
  --cluster geoscience-cluster \
  --service-name gwl-prediction \
  --task-definition gwl-task:1 \
  --desired-count 2 \
  --launch-type FARGATE

# 4. Configurar Auto Scaling
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/geoscience-cluster/gwl-prediction \
  --min-capacity 2 \
  --max-capacity 10
```

---

## PRESUPUESTO ESTIMADO

### Proyecto Piloto (3 meses)

| Concepto | Costo (USD) |
|----------|-------------|
| Workstation (GPU mid-range) | $2,000 |
| Software (todo open-source) | $0 |
| Consultoría ML (50 hrs @ $100/hr) | $5,000 |
| Preparación datos (100 hrs @ $50/hr) | $5,000 |
| **Total Piloto** | **$12,000** |

### Producción Año 1

| Concepto | Costo Anual (USD) |
|----------|-------------------|
| Cloud infrastructure (AWS/GCP) | $6,000 |
| MLOps platform (MLflow self-hosted) | $0 |
| Mantenimiento/reentrenamiento (200 hrs) | $10,000 |
| Monitoreo y alertas | $2,000 |
| **Total Año 1** | **$18,000** |

### ROI Esperado

**Hidrogeología**:
- Reducción 20% costos de sobreexplotación
- Detección temprana contaminación: -$50k-$200k en remediación

**Minería**:
- Reducción 15-25% costos exploratorios: $500k-$2M ahorros
- Incremento 30% eficiencia modelado: -$100k en tiempo geologistas

**Payback period**: 3-9 meses típicamente

---

## CHECKLIST FINAL PRE-DEPLOYMENT

### Técnico
- [ ] Modelo supera baseline en 20%+
- [ ] Validación cruzada espacial/temporal consistente
- [ ] API con latencia <200ms (p95)
- [ ] Tests unitarios >80% coverage
- [ ] Logging y monitoreo configurado
- [ ] Plan de rollback documentado

### Negocio
- [ ] Stakeholders técnicos capacitados
- [ ] Documentación usuario final
- [ ] SLAs definidos (uptime, latencia, precisión)
- [ ] Proceso de escalamiento a soporte establecido
- [ ] Métricas de éxito acordadas

### Compliance
- [ ] Datos sensibles anonimizados
- [ ] Seguridad API (autenticación OAuth2)
- [ ] Backups automáticos configurados
- [ ] Logs de auditoría habilitados

---

*Documento de implementación práctica complementario al Brochure Técnico IA Geociencias*
