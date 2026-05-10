# Supervised Learning

Supervised learning is a machine learning paradigm where a model is trained on a
labeled dataset, meaning each training example is paired with a target output.
The goal is to learn a mapping from inputs (features) to outputs (labels) that
generalizes to unseen data.

## Two main task types

- **Classification**: predicting a discrete category. Examples: spam vs not-spam,
  digit recognition (0-9), disease vs no-disease.
- **Regression**: predicting a continuous value. Examples: house price, temperature,
  expected revenue.

## Common algorithms

- Linear regression and logistic regression
- Decision trees, random forests, gradient boosting (XGBoost, LightGBM)
- Support vector machines (SVMs)
- k-Nearest Neighbors (k-NN)
- Neural networks (for both classification and regression)

## Workflow

1. Collect a labeled dataset.
2. Split into train, validation, and test sets.
3. Choose a model and loss function (e.g. cross-entropy for classification,
   mean squared error for regression).
4. Optimize parameters via gradient descent or a closed-form solution.
5. Evaluate on the held-out test set with metrics like accuracy, F1, RMSE.

## Key challenges

- Overfitting: the model memorizes training data and fails on new data.
  Regularization (L1/L2), dropout, early stopping, and more data help.
- Class imbalance: when one label dominates, accuracy becomes misleading.
  Use F1, precision/recall, ROC-AUC, or resampling techniques.
- Label noise: incorrect labels degrade performance, especially in deep models.
