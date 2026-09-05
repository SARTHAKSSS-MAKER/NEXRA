import pandas as pd
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score
)

from imblearn.over_sampling import SMOTE

import joblib


# =========================================================
# PROJECT PATHS
# =========================================================

# Project root = NEXRA/
BASE_DIR = Path(__file__).resolve().parents[2]

DATASET_PATH = BASE_DIR / "ml" / "datasets" / "creditcard.csv"
MODEL_DIR = BASE_DIR / "ml" / "models"

MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODEL_DIR / "fraud_detection_model.pkl"
SCALER_PATH = MODEL_DIR / "scaler.pkl"
TEST_DATA_PATH = MODEL_DIR / "test_data.pkl"


# =========================================================
# START
# =========================================================

print("\n" + "=" * 60)
print("              NEXRA FRAUD DETECTION")
print("              MODEL TRAINING SYSTEM")
print("=" * 60)


# =========================================================
# LOAD DATASET
# =========================================================

print("\n" + "=" * 60)
print("LOADING DATASET")
print("=" * 60)

print("Dataset path:")
print(DATASET_PATH)

if not DATASET_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found:\n{DATASET_PATH}"
    )

df = pd.read_csv(DATASET_PATH)

print("\nDataset loaded successfully!")
print("Original shape:", df.shape)


# =========================================================
# REMOVE DUPLICATES
# =========================================================

print("\n" + "=" * 60)
print("REMOVING DUPLICATES")
print("=" * 60)

duplicates = df.duplicated().sum()

print("Duplicate rows found:", duplicates)

df = df.drop_duplicates()

print("Shape after removing duplicates:", df.shape)


# =========================================================
# FEATURES AND TARGET
# =========================================================

print("\n" + "=" * 60)
print("FEATURES AND TARGET")
print("=" * 60)

if "Class" not in df.columns:
    raise ValueError(
        "Dataset must contain a 'Class' column."
    )

X = df.drop("Class", axis=1)
y = df["Class"]

print("Features shape:", X.shape)
print("Target shape:", y.shape)

print("\nFeature columns:")
print(list(X.columns))


# =========================================================
# VERIFY FEATURE COUNT
# =========================================================

print("\n" + "=" * 60)
print("VERIFYING FEATURES")
print("=" * 60)

if X.shape[1] != 30:
    raise ValueError(
        f"Expected 30 features "
        f"(Time + V1-V28 + Amount), "
        f"but dataset contains {X.shape[1]}."
    )

print("Feature count:", X.shape[1])
print("Feature verification successful!")


# =========================================================
# CLASS DISTRIBUTION
# =========================================================

print("\n" + "=" * 60)
print("OVERALL CLASS DISTRIBUTION")
print("=" * 60)

class_counts = y.value_counts()

print(class_counts)

print("\nClass percentages:")
print(
    (y.value_counts(normalize=True) * 100).round(4)
)


# =========================================================
# TRAIN / TEST SPLIT
# =========================================================

print("\n" + "=" * 60)
print("TRAIN / TEST SPLIT")
print("=" * 60)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)
joblib.dump(
    {
        "X_test": X_test,
        "y_test": y_test
    },
    TEST_DATA_PATH
)

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))


# =========================================================
# TRAINING CLASS DISTRIBUTION
# =========================================================

print("\n" + "=" * 60)
print("TRAINING CLASS DISTRIBUTION")
print("=" * 60)

print(y_train.value_counts())

print("\nTraining percentages:")
print(
    (y_train.value_counts(normalize=True) * 100).round(4)
)


# =========================================================
# TESTING CLASS DISTRIBUTION
# =========================================================

print("\n" + "=" * 60)
print("TESTING CLASS DISTRIBUTION")
print("=" * 60)

print(y_test.value_counts())

print("\nTesting percentages:")
print(
    (y_test.value_counts(normalize=True) * 100).round(4)
)


# =========================================================
# FEATURE SCALING
# =========================================================

print("\n" + "=" * 60)
print("FEATURE SCALING")
print("=" * 60)

scaler = StandardScaler()

# IMPORTANT:
# Fit scaler ONLY on training data
X_train_scaled = scaler.fit_transform(X_train)

# Apply the same scaler to test data
X_test_scaled = scaler.transform(X_test)

print("Feature scaling completed successfully!")

print(
    "Scaler features:",
    scaler.n_features_in_
)


# =========================================================
# HANDLE CLASS IMBALANCE - SMOTE
# =========================================================

print("\n" + "=" * 60)
print("HANDLING CLASS IMBALANCE - SMOTE")
print("=" * 60)

print("\nBefore SMOTE:")
print(y_train.value_counts())

smote = SMOTE(
    random_state=42
)

X_train_resampled, y_train_resampled = smote.fit_resample(
    X_train_scaled,
    y_train
)

print("\nAfter SMOTE:")
print(y_train_resampled.value_counts())

print("\nResampled training shape:")
print("Features:", X_train_resampled.shape)
print("Target:", y_train_resampled.shape)


# =========================================================
# TRAIN LOGISTIC REGRESSION
# =========================================================

print("\n" + "=" * 60)
print("TRAINING LOGISTIC REGRESSION")
print("=" * 60)

model = LogisticRegression(
    max_iter=1000,
    random_state=42
)

model.fit(
    X_train_resampled,
    y_train_resampled
)

print("Model trained successfully!")


# =========================================================
# PREDICTIONS
# =========================================================

print("\n" + "=" * 60)
print("GENERATING PREDICTIONS")
print("=" * 60)

y_pred = model.predict(X_test_scaled)

y_probability = model.predict_proba(
    X_test_scaled
)[:, 1]

print("Predictions generated successfully!")


# =========================================================
# CLASSIFICATION REPORT
# =========================================================

print("\n" + "=" * 60)
print("CLASSIFICATION REPORT")
print("=" * 60)

print(
    classification_report(
        y_test,
        y_pred,
        target_names=[
            "Normal",
            "Fraud"
        ],
        digits=4
    )
)


# =========================================================
# CONFUSION MATRIX
# =========================================================

print("\n" + "=" * 60)
print("CONFUSION MATRIX")
print("=" * 60)

cm = confusion_matrix(
    y_test,
    y_pred
)

print(cm)

print("\nMatrix format:")
print(
    "[[True Negative, False Positive]"
)
print(
    " [False Negative, True Positive]]"
)


# =========================================================
# ROC-AUC
# =========================================================

print("\n" + "=" * 60)
print("ROC-AUC SCORE")
print("=" * 60)

roc_auc = roc_auc_score(
    y_test,
    y_probability
)

print(f"ROC-AUC: {roc_auc:.4f}")


# =========================================================
# SAVE MODEL
# =========================================================

print("\n" + "=" * 60)
print("SAVING MODEL")
print("=" * 60)

# Save ONLY the model that the FastAPI backend expects
joblib.dump(
    model,
    MODEL_PATH
)

# Save the exact scaler used during training
joblib.dump(
    scaler,
    SCALER_PATH
)

print("\nModel saved successfully:")
print(MODEL_PATH)

print("\nScaler saved successfully:")
print(SCALER_PATH)


# =========================================================
# VERIFY SAVED FILES
# =========================================================

print("\n" + "=" * 60)
print("VERIFYING SAVED FILES")
print("=" * 60)

if MODEL_PATH.exists():
    print("✓ fraud_detection_model.pkl exists")
else:
    print("✗ Model file was not created")

if SCALER_PATH.exists():
    print("✓ scaler.pkl exists")
else:
    print("✗ Scaler file was not created")


# =========================================================
# FINAL SUMMARY
# =========================================================

print("\n" + "=" * 60)
print("TRAINING COMPLETED SUCCESSFULLY")
print("=" * 60)

print("\nDataset:")
print("  Samples:", len(df))
print("  Features:", X.shape[1])

print("\nTraining:")
print("  Original:", len(X_train))
print("  After SMOTE:", len(X_train_resampled))

print("\nTesting:")
print("  Samples:", len(X_test))

print("\nPerformance:")
print(f"  ROC-AUC: {roc_auc:.4f}")

print("\nSaved files:")
print("  fraud_detection_model.pkl")
print("  scaler.pkl")

print("\n" + "=" * 60)
print("NEXT STEP")
print("=" * 60)

print("Connect the trained model to NEXRA backend.")
print("=" * 60)