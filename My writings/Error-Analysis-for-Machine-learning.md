## Working with Skewed Datasets.
Till now, we have seen the models generated on standard datasets. Other than these, we also have models where we need to work on skewed datasets and perform error analysis. We might develop a model for a factory where 99.7% of produced goods have no defects and only 0.3% have flaws. Or we could build a medical diagnosis system where 99% of the patients don’t have the disease.
In these cases, we don’t use accuracy. Instead, we will build a Confusion matrix and calculate Precision and Recall for the predictions. The confusion matrix typically is a 2x2 matrix that generally has the model predictions along one axis and the true labels along the other axis. The following image describes a typical confusion matrix.
![A confusion matrix](https://miro.medium.com/v2/resize:fit:654/1*naTNypqwo5VU_nwOp9csrg.png)
Using the values in the confusion matrix, we might also form different metrics and use them. Some of the metrics are precision and recall.
**Precision**: The proportion of true predictions that are actually true.
![](https://miro.medium.com/v2/resize:fit:542/1*xQ5bQVttDer1cPc3AykyNQ.png)
**Recall:** The proportion of actual true predictions that are identified correctly.
![Definition of recall](https://miro.medium.com/v2/resize:fit:370/1*x9EnZegFHcmRN0dNepTmcA.png)
The formula for Recall.
Since we have to constantly monitor these 2 metrics each and every time, some hybrid metrics, which alert when even one is not suitable, are defined by combining these two metrics. One of the standard metrics is the f-beta score, the weighted harmonic mean of precision and recall, reaching its optimal value at 1 and its worst value at 0.
The most commonly used f-beta score is the f-1 score, where we give equal weights to precision and recall.
![F1 score for models based on skewed datasets.](https://miro.medium.com/v2/resize:fit:464/1*T5-K6H1FM75DPt4-Vj3x4w.png)
The formula for F1 score.
So far, we have only seen the metrics for binary classification problems. But there are different ways to use these metrics for multi-class metrics. One way is to find the metrics independently for each class and use them to evaluate the model, i.e., consider each class as a binary classification.
## Performance Auditing
Even when the model is performing well in training metrics and error analysis, it is recommended to do one final performance audit before sending it to production. There are many ways an audit might be performed.
One framework to audit your model is as follows.
1.  Brainstorming the ways the model can go wrong like
2.  Performance on the subsets of data,
3.  How common are specific errors?
4.  Performance on rare classes, etc.,
5.  After identifying how the model can go wrong, you can establish metrics to assess performance against these issues.
6.  After establishing these metrics, we can manually evaluate them or use different automated MLOps tools for auditing this performance.
> Until now, this manual process is preferred, however, in the recent times there are emerging MLOps tools that helps us easily identify different kinds of errors. At the end it is up to the preference of the users.
With this, we have finished going through the error analysis of the machine learning models. Now, there is one last step left to explore in the modeling phase of a project, which is the **data-driven** approach to modeling. I am working on this article currently, and you can expect it before the same time, next week.
In the meantime, if you want to read my notes on CNN, you can read them [here](https://akhiltvsn.medium.com/cnn-notes-1-the-convolution-operation-e2a47be1d890), or if you still haven’t read the last part of MLOps notes, you can find them [here](https://akhiltvsn.medium.com/mlops-notes-1-the-machine-learning-lifecycle-6719a25004a8) or in the links provided below**. Thanks for read**ing!
P.S. you can subscribe using this [link](https://akhiltvsn.medium.com/subscribe) if you like this article and want to be notified as soon as a new article released.