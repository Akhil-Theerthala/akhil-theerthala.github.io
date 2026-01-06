## Deployment Patterns
Depending on the use case, we have different patterns for different stages of deployment. Some of the scenarios of deploying are,
-   If we offer a new product/service, we generally start by providing it to a small amount of traffic and gradually opening it up.
-   If we automate/assist a manual task, we see that **_shadow_** mode deployment is a better approach.
-   If there is already a previous version that is being replaced, the **_Blue-green_** pattern is recommended.
But, in all the cases, we see the following key ideas underneath,
1.  Gradually increasing the traffic with monitoring after getting proof that the system is working. **(Canary)**
2.  Making **Rollback** to previous versions possible.
**Some common deployment patterns:**
-   **Shadow mode:** We first make the ML system run parallelly along with the model, where we only consider Human interpretation as the final result, and then, after monitoring and proving that it is making good decisions, we replace the human.
![Examples with the outputs from the model and Human, to test the system in shadow mode.](https://miro.medium.com/v2/resize:fit:1400/1*3XO9bjP-2MGajsqJuKJO2w.png)
Shadow mode deployment. Source: [Deeplearning.ai](https://www.deeplearning.ai/courses/machine-learning-engineering-for-production-mlops/), licensed under the [Creative Commons](https://en.wikipedia.org/wiki/en:Creative_Commons) [Attribution-ShareAlike 2.0](https://creativecommons.org/licenses/by-sa/2.0/legalcode) license.
-   A typical deployment pattern, in this case, is called **Canary** deployment, where we initially roll out to a small fraction (5%) of traffic and ramp up the traffic gradually.
-   Another kind of deployment pattern is called **the Blue-Green** deployment system, where we parallelly use both old versions and the new version of the model and have the router switch from the old version to the latest version. This makes the **Rollback** very easy.
![Illustration of Blue-Green deployment system for MLOps.](https://miro.medium.com/v2/resize:fit:1400/1*1I6np0DGR6OtqiVDl1hVoQ.png)
Blue-Green Deployment pattern. Source: [Deeplearning.ai](https://www.deeplearning.ai/courses/machine-learning-engineering-for-production-mlops/), licensed under the [Creative Commons](https://en.wikipedia.org/wiki/en:Creative_Commons) [Attribution-ShareAlike 2.0](https://creativecommons.org/licenses/by-sa/2.0/legalcode) license.
It is also recommended to consider the deployment in terms of _Degrees of Automation_. Where the system is gradually changed from
Human only → Shadow mode → AI Assistance for Humans → Partial Automation (Based on the confidence of the model) → Complete Automation
Many applications go through these degrees, and some stop at stages like AI assistance or Partial automation, collectively called **Human-in-the-loop** systems.
## Monitoring an ML system
The most common way to monitor systems is to use **Monitoring dashboards.** Where we have a real-time chart, each with different aspects like _server load, a fraction of non-null outputs, a fraction of missing values,_ etc.,
![An example of monitoring dashboards for deployed systems](https://miro.medium.com/v2/resize:fit:1400/1*uYYox7Oq_mi8Z9Wa92Dy_g.png)
Sample dashboard of a project. Source: [Deeplearning.ai](https://www.deeplearning.ai/courses/machine-learning-engineering-for-production-mlops/), licensed under the [Creative Commons](https://en.wikipedia.org/wiki/en:Creative_Commons) [Attribution-ShareAlike 2.0](https://creativecommons.org/licenses/by-sa/2.0/legalcode) license.
Deciding what to look into and what to leave alone depends on the project, and the team must brainstorm all the things that could go wrong and give out a few metrics to detect the problems. It is not a problem to use many metrics initially and remove useless ones overtime.
When monitoring, we also set alarms by setting specific thresholds for each metric to immediately take respective measures. These thresholds are not fixed and need to be adapted for each system.
There are 3 major categories into which the metrics are classified generally.
**Software Metrics**: Metrics that measure the software performance of the service, like,
-   Memory used
-   Latency
-   throughput
-   Server load etc.,
**Input metrics**: Metrics that monitor the inputs given to the service to take note of the changes. Some of them are,
-   Avg. input volume
-   Avg. input length
-   Fraction of input missing values etc.,
**Output Metrics:** Metrics that monitor the outputs given by the systems, like,
-   No. of times null return
-   No. of times the user redoes the search
-   No. of times that the user switches to a different mode of input to the system to obtain better results.
-   Click-through rate (CTR)
> ⚠️ **Note:
> 
> \-** The input and output metrics are mostly application specific.
> 
> \- Similar to training a model, the deployment and monitoring process is also iterative. We first deploy and set up the monitoring dashboards. We then monitor the performance w.r.t. the users, followed by performance analysis of the system and make relevant changes according to the results.
When a model needs to be updated, it either needs to be retrained manually or automatically. Today in the market, though manual retraining is preferred over automatic retraining, we see many MLOps tools come with sophisticated services that make the entire process easier.
## Monitoring a Production Pipeline
Many AI systems are not a single system but rather a pipeline of different systems.
_For example_, in a **simple speech transcription system**, we see that the audio is first passed through a VAD module which is inbuilt into the mobile device, which strips the audio only where the speech is detected and gives it to the speech recognition model on the cloud. The model then sends back the transcript of the speech.
![An illustration of a simple speech recognition model, where the audio is passed from VAD module to the speech recognition model in the cloud.](https://miro.medium.com/v2/resize:fit:1400/1*BWwjozx5HhC97WQvCDfpRQ.png)
Pipeline of a simple speech transcription system. Source: [Deeplearning.ai](https://deeplearning.ai/), licensed under the [Creative Commons](https://en.wikipedia.org/wiki/en:Creative_Commons) [Attribution-ShareAlike 2.0](https://creativecommons.org/licenses/by-sa/2.0/legalcode) license.
So, the input to the speech recognition system depends on the performance of the VAD module.
Similarly, in a more complex system, the input is passed through different modules, each with its own individual processing methods and tiny losses. These minor errors add up and magnify by the time the result is determined. Hence, we need to make sure that we monitor each and every module independently, along with the result of the entire pipeline.
**Metrics to monitor:**
For these kinds of different systems, we need metrics to evaluate the performance of these systems. These are also classified into the 3 categories mentioned above, i.e., software metrics, input metrics, and output metrics.
**How quickly do these metrics change?**
This question is application dependent. For example, in a face recognition pipeline, the faces of people change very gradually, so the metrics don’t change rapidly. However, in another instance of defect detection systems, the metrics change quickly depending on the lighting conditions, time of the day, etc.
This concludes the overview of the deployment portion of the system. Next, we will take one more step back and get an overview of the challenges in developing a model for production. Since I found that the articles are becoming longer, from the next one, I decided to make a single note into meaningful parts so that reading them becomes more straightforward. So stay tuned to the upcoming articles!
In the meantime, if you want to read my notes on CNN, you can read them [here](https://akhiltvsn.medium.com/cnn-notes-1-the-convolution-operation-e2a47be1d890), or if you still haven’t read the first part of MLOps notes, you can find it [here](https://akhiltvsn.medium.com/mlops-notes-1-the-machine-learning-lifecycle-6719a25004a8). You can also look into one of my old data analytics projects on my [medium page](https://akhiltvsn.medium.com/). Follow me for constant updates on new articles.