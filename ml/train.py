"""Train on Cresci CSVs; exports Logistic Regression weights to server/model.json.
Usage: python ml/train.py genuine_users.csv fake_users.csv"""
import sys, json, numpy as np, pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
g = pd.read_csv(sys.argv[1], encoding='latin1', low_memory=False); g['y'] = 0
b = pd.read_csv(sys.argv[2], encoding='latin1', low_memory=False); b['y'] = 1
d = pd.concat([g, b], ignore_index=True)
n = lambda c: pd.to_numeric(d[c], errors='coerce').fillna(0) if c in d else pd.Series(0, index=d.index)
age = (pd.Timestamp('2016-01-01') - pd.to_datetime(d.get('created_at'), errors='coerce')).dt.days.fillna(0)
desc = d['description'].fillna('').astype(str).str.len().gt(0).astype(int) if 'description' in d else pd.Series(0, index=d.index)
X = pd.DataFrame({'log_followers': np.log1p(n('followers_count')), 'log_friends': np.log1p(n('friends_count')),
  'ratio': np.log((n('followers_count')+1)/(n('friends_count')+1)), 'log_statuses': np.log1p(n('statuses_count')),
  'age_years': age/365, 'has_desc': desc, 'default_img': n('default_profile_image')}); y = d['y']
print('CV acc (LR):', cross_val_score(LogisticRegression(max_iter=3000), StandardScaler().fit_transform(X), y, cv=5).mean())
lr = LogisticRegression(max_iter=3000).fit(X, y)
json.dump({'bias': float(lr.intercept_[0]) - 1.5, 'w': dict(zip(X.columns, map(float, lr.coef_[0])))}, open('server/model.json', 'w'), indent=1)
try:
    import lightgbm as lgb; print('CV acc (LightGBM):', cross_val_score(lgb.LGBMClassifier(n_estimators=300, verbose=-1), X, y, cv=5).mean())
except ImportError: pass

# ---- Deep learning: MLP (64,32), weights exported for the Node server ----
from sklearn.neural_network import MLPClassifier
sc = StandardScaler().fit(X); mlp = MLPClassifier((64, 32), max_iter=400, random_state=42).fit(sc.transform(X), y)
print('CV acc (MLP):', cross_val_score(MLPClassifier((64, 32), max_iter=400, random_state=42), sc.transform(X), y, cv=5).mean())
json.dump({'cols': list(X.columns), 'mean': sc.mean_.tolist(), 'std': sc.scale_.tolist(),
  'layers': [{'W': w.tolist(), 'b': b.tolist()} for w, b in zip(mlp.coefs_, mlp.intercepts_)]}, open('server/model_mlp.json', 'w'))
