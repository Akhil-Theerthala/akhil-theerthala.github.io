# Diversity Vs Density: A strategy comparison for fine-tuning VLMs

The more I see the impact and expansion of agentic applications of LLMs, the more I foresee a future in which people will be increasingly concerned with developing a custom model that suits their needs. This may be due to various factors, ranging from cost savings from API calls to issues related to data privacy and domain expertise. This shift requires rigorous cost-effectiveness studies to fine-tune these models. Various works, such as [OpenThoughts](https://arxiv.org/abs/2506.04178), [HoneyBee](https://arxiv.org/abs/2510.12225), and others, have made substantial contributions to the development of these strategies. 

However, there remains a gap in these recipes for image-text-to-text fine-tuning, as large, diverse image datasets are often scarce, especially in domains such as robotics, banking, and manufacturing. Hence, we must conduct a rigorous study of this "number of images" argument. And that's what I have done for the last few days. 

<figure>
  <img src="https://cdn-uploads.huggingface.co/production/uploads/676c67da7bad1587f2d046e2/XcN0Q2_Kue4sv3VTXsjoo.png">
  <figcaption>Density Vs Diversity strategy for data curation. Image generated using NanoBanana Pro</figcaption>
</figure>

## I. The problem
Based on current mainstream works, there are two approaches to improving language models' ability to answer questions about images. One approach, the diversity approach, aims to help the model interpret image encodings by presenting a vast set of images and associated questions. 

Whereas the other, the density approach, asks various questions about the same image, forcing the model to interpret the same image encoding in different ways. In practice, a combination of these two steps is used to train VLMs. The core question of this blog post is to answer which of the two approaches is suitable, or more specifically, which of the two extremes is ideal. 


## II. Why is this useful?
Before we do the analysis, one might ask: *Why bother with Density? Diversity is safer and generally performs better. Why not just scrape more images?*

However, the trade-off lies in the **economics** of the data. 
1. Most real-world domains don't have a massive amount of image data available, which increases the cost of curating a considerable number of diverse images for the task. In these "Data Poor" domains, the standard advice ("just get more data") is useless. If the density strategy works—even if it's just on par with Diversity—it unlocks a massive opportunity.
2. Similarly, the token costs of generating queries from 7500 images are considerably higher than generating queries from 750 images. In these cases, handling textual entities is less computationally expensive than handling image embeddings and is often faster.
3. Finally, there's the philosophical question of "Seeing more things" Vs "Seeing the same thing deeply". The belief is that asking a variety of questions on the same image will lead to better reasoning than forcing the model to look at various photos. (This is also a surprisingly popular strategy in data curation.)

The goal of this work is to do a preliminary investigation towards this hypothesis. To establish an initial hypothesis, I set up the environment and studied the two extremes of curation strategies.

---

## III. The Setup
To test this, I conducted a controlled experiment using images from the GQA dataset as the seed to generate synthetic datasets for spatial interpretation. 

### A. The Data Curation

<figure>
  <img src="https://cdn-uploads.huggingface.co/production/uploads/676c67da7bad1587f2d046e2/wfm645VlDdinA23NIyIZ1.png">
  <figcaption>The multi-stage data generation process.</figcaption>
</figure>

Out of the ~37k images from the GQA training set, a smaller set of images containing at least seven different objects is chosen. Using this as the main seed, two samples of 7500 images and 750 images are selected. 

To clearly separate the two extremes of Density and Diversity, the density approach generates 10 questions per image, whereas the diversity approach asks one key question per image. For each image, a detailed scene description is generated, which is then used to create answer plans and questions, as well as the reasoning and answers. To address stability and response constraints, each question is accompanied by two synthetically generated answers. 

All the questions generated in the synthetic data can be sorted into the following topics:
* **Spatial_Topology**: Question involving relative positions, distances, orientation,  alignment or layout.
* **Object_Interaction_Physics**: Question regarding stability or physical properties inferred from visuals and support, containment, or contact. (e.g., 'What supports object X?')
* **Visibility_Occlusion**: Question about what is visible, partially visible, or occluded from the viewpoint, and line-of-sight or viewing angles from different perspectives.
* **Functional_Reasoning**: Question about how objects might be used together based on proximity, and about accessibility or affordance.
* **Comparative_Attribute**: Question comparing size, height, or state between two specific objects and differentiating two similar objects based on context.
In the dense approach, the ten questions include two questions from each category. 

With this, we obtain two datasets, each containing 15k samples, at the extremes of the investigation. A similar strategy was used to develop a test set, whose answers are generated and selected via majority voting among `Qwen3-VL-235B`, `GPT5-mini`, and `Gemini-Flash`.

### B. The Training Regime.
The core challenge of the problem at hand is not changing how the model "sees", but rather how the language model interprets what it sees. Hence, across all fine-tuning regimes, the vision-encoding towers are frozen. Following this, I have opted for a LoRA fine-tuning regime, as it's more suitable than full-SFT for the scale of the study. Each model was trained for two epochs with a learning rate of `1e-5` and a cosine learning rate scheduler with a minimum learning rate of `1e-6`.

To investigate the impact, six models are fine-tuned from three backbones: `Qwen3-VL-4B-Instruct`, `Qwen3-VL-8B-Instruct`, and `Qwen3-VL-8B-Thinking`. 


---

## IV. The Results

<figure>
  <img src="https://cdn-uploads.huggingface.co/production/uploads/676c67da7bad1587f2d046e2/Ym8vQSJAjbz37Ff7tQeET.png">
  <figcaption>Evaluation results on the in-domain test set (3.2k images) and the RealWorldQA benchmark. </figcaption>
</figure>

Using the provided setup, the models are trained and evaluated on 3.2k images and the RealWorld QA benchmark. The evaluation of the trained models is split into two phases. 
* **Phase-1: Test-set performance** </br> In this phase, the models are evaluated on a test-set generated and validated by the SOTA models. This is done to understand how well the model interprets and learns from the training dataset strategies.
* **Phase-2: RealWorldQA Benchmark**</br> In this phase, the model is evaluated on a benchmark that requires understanding the real-world images and interpreting them. For this phase, the RealworldQA benchmark is selected primarily due to its availability. 


In summary, the diversity strategy clearly outperforms the dense strategy (by at least 3.2%). However, when combined with the robustness tests, a strangely intriguing picture emerges.

According to the RealWorldQA results, the Diverse strategy performs consistently across modalities, with each performing within 1% of the other. Based on this, it's possible that a diverse visual dataset may also serve as a form of regularization for language-side adaptation of VLMs. By requiring the model to process thousands of distinct visual contexts, it prevents the model from becoming overfit to any single "style" of image. This is consistent with the hypothesis that when the model encounters the chaotic real world, it can rely on a stable, generalized representation.

However, the results of the dense strategy are interesting. Only the in-domain results show that increasing model scale improves test-set performance. The OOD, though, shows a different picture. The non-reasoning models perform similarly well on the RealWorldQA benchmark. Yet, the drop in the reasoning model's performance is consistent with a failure to induce transferable reasoning abstractions under dense curation rather than the expected improvement in reasoning capabilities.
This challenges the assumption that increasing question variety alone is sufficient to improve transferable reasoning. However, this could also be a side effect of the smaller sample size, which may lead to overfitting. 

It is also clear that, as a result of the LoRA effect, the model learned less than intended while forgetting even less information relevant to the inherent real-world information

---

## V. Conclusion

So, can we train on 750 images instead of 7500? 
The answer is yes, but with caveats. Density appears to be an efficiency trade-off rather than a strict substitute. You can obtain a model that performs within 5% of the ideal model trained on diverse, curated data. However, it's not a magic wand. For non-reasoning models, the density strategy works really well. However, reasoning models carry a risk of logical collapse and require careful treatment. 

### What's next? 
Since the results establish the _feasibility_ of dense curation under constrained data budgets, the goal now is to examine the problem at a larger scale. Since 750/7500 images are not a sufficiently large sample to establish generalised "facts", the next steps of the work should focus on a 25k-image range with at least 50k training samples. 

Additionally, the study only limits the results to the extremes. A more nuanced examination of different density scales should also be conducted to obtain a clearer picture. What if, just like the batch size, density also has a too-small-to-too-large trade-off? If so, what's the optimal approach, and how does performance vary with scale? These questions have to be involved. 

Tangentially, the effect of synthetic diversity, such as image augmentation, must also be studied, as it provides clear benefits for data-poor domains. 

### What didn't work?
During the process, I've tried many interesting approaches. Starting with various ranks and alphas for LoRA. More specifically, because I had access to Hugging Face hardware, I trained LoRAs with four ranks: 128, 64, 32, and 16, mostly with `rank=alpha`. On a high level, here are the key observations:

* The ranks 128 and 64 significantly degraded the models' language coherence. I often found token repetition and language mixing.
* The rank 16 was taking too long to converge, and sometimes (especially in the 8B case), not being stuck around CE losses of 1.45-1.5. 
* The generally accepted learning rates of 1e-4 to 2e-4 were surprisingly high and indicated classic overfitting during training. The current training uses a learning rate of 1e-5 with a cosine scheduler with a minimum learning rate of `1e-6`. 

In addition, I found that generating questions directly from images (rather than using the process described above) was suboptimal. Almost all models, from Qwen3-VL-235B and Gemma3 to GPT-5-mini, focused on the same visual parts of the image, despite varying decoding conditions. This suggests the presence of strong encoder-level priors in the representation of visual salience. For models using SigLIP-2 encoders, this may indicate a shared attention bias that limits question diversity. However, isolating encoder effects from decoder behaviour requires controlled ablations (e.g., encoder swapping or frozen-encoder probing), which we leave for future work.

---
There are many more questions to be answered, and the current results represent only an initial study of this approach. Stay tuned and also reach out if you're interested in exploring this!