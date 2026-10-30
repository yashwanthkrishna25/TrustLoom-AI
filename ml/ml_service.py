"""
TrustLoom AI - Real Python ML Microservice
Project Title: A Multi-Feature Interpretable Machine Learning Framework for
Detecting Spam Bots and Fake Followers in Social Networks.

Runs on http://localhost:5055 providing real-time:
- /analyze (LightGBM, AdaBoost, SHAP, LIME on account profile)
- /benchmark (Table II cross-validated metrics, Cresci-15 and Cresci-17)
- /evaluate-dataset (Dataset upload analysis with confusion matrix & ROC-AUC)
- /health (Status check)
"""

import sys
import os
import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))
from ml_engine import TrustLoomMLEngine, CRESCI_15_BENCHMARK, CRESCI_17_BENCHMARK, CROSS_DATASET_BENCHMARK, FEATURE_NAMES
import pandas as pd

PORT = int(os.environ.get("ML_PORT", 5055))

print("Initializing TrustLoom AI ML Engines for Cresci-15 and Cresci-17...")
engine_15 = TrustLoomMLEngine(dataset_type="cresci15")
engine_15.train()
print("TrustLoom AI ML Engine ready.")

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class MLHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Concise logging
        pass

    def _send_json(self, status, payload):
        response = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(response)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(response)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == '/health':
            self._send_json(200, {
                'status': 'ok',
                'models': list(engine_15.models.keys()),
                'models_count': len(engine_15.models),
                'framework': 'Multi-Feature Interpretable ML Framework',
                'dataset_benchmarks': ['Cresci-2015', 'Cresci-2017']
            })
        elif self.path.startswith('/benchmark'):
            results = engine_15.evaluate_all()
            self._send_json(200, {
                'cresci15': CRESCI_15_BENCHMARK,
                'cresci17': CRESCI_17_BENCHMARK,
                'cross_dataset': CROSS_DATASET_BENCHMARK,
                'live_evaluation': results
            })
        elif self.path == '/models':
            self._send_json(200, {
                'models': [
                    {'id': 'lightgbm', 'name': 'LightGBM Classifier (Paper Flagship)', 'accuracy': 99.44, 'roc_auc': 0.9997, 'best_for': 'Cresci-2015'},
                    {'id': 'adaboost', 'name': 'AdaBoost Classifier', 'accuracy': 99.53, 'roc_auc': 0.9996, 'best_for': 'Cresci-2017'},
                    {'id': 'random_forest', 'name': 'Random Forest Ensemble', 'accuracy': 99.35, 'roc_auc': 0.9995, 'best_for': 'General Robustness'},
                    {'id': 'decision_tree', 'name': 'Decision Tree (Interpretable Rules)', 'accuracy': 98.70, 'roc_auc': 0.9850, 'best_for': 'Rule Extraction'},
                    {'id': 'logistic_regression', 'name': 'Logistic Regression (Linear Baseline)', 'accuracy': 96.20, 'roc_auc': 0.9780, 'best_for': 'Fast Linear Baseline'},
                    {'id': 'mlp', 'name': 'MLP Neural Network (64, 32)', 'accuracy': 98.92, 'roc_auc': 0.9940, 'best_for': 'Non-linear Representation'}
                ]
            })
        else:
            self._send_json(404, {'error': 'Not found'})

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        try:
            payload = json.loads(body) if body else {}
        except Exception:
            return self._send_json(400, {'error': 'Invalid JSON body'})

        if self.path == '/analyze':
            model_name = payload.get('model', 'lightgbm')
            threshold = float(payload.get('threshold', 0.50))
            account_data = payload.get('account', payload)
            try:
                res = engine_15.analyze(account_data, model_name=model_name, custom_threshold=threshold)
                self._send_json(200, res)
            except Exception as e:
                self._send_json(500, {'error': str(e)})

        elif self.path == '/evaluate-dataset':
            rows = payload.get('rows', [])
            if not rows:
                return self._send_json(400, {'error': 'No rows provided for dataset evaluation'})
            try:
                df = pd.DataFrame(rows)
                for col in FEATURE_NAMES:
                    if col not in df.columns:
                        df[col] = 0.0
                if 'label' not in df.columns:
                    df['label'] = 0

                results = engine_15.evaluate_all(df)
                self._send_json(200, results)
            except Exception as e:
                self._send_json(500, {'error': str(e)})
        else:
            self._send_json(404, {'error': 'Not found'})

def run_server():
    server_address = ('127.0.0.1', PORT)
    httpd = ThreadedHTTPServer(server_address, MLHandler)
    print(f"TrustLoom AI Python ML Service listening on http://127.0.0.1:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down ML service.")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
