## Reasoning Models #2 — The Dataset Creation
In the pursuit of understanding reasoning models, the first major roadblock anyone would encounter is finding the right problem to solve. Despite the general understanding of the training regime, we need to solve a problem end-to-end to understand the hidden intricacies of developing a reasoning model. That’s how I started this journey anyway.
The following series of articles is a log of everything I had to learn to tune a reasoning model into solving a problem I’d usually like to avoid. This discussion aims to summarise how I chose a problem to solve and how I generated the dataset.
## 1\. The problem to choose.
## What areas do I want to choose?
Well, there are two areas that I’m eternally curious about. The first one is **Psychology**. I always wanted to understand and get a hypothesis on how I or anyone I know behaved in a certain way in a certain situation. However, I’m not well-versed in the subject. So, I could only depend on responses online or some random Psychology 101 books to refer to. However, when I thought about building a reasoning model, the most interesting thing was a psychological reasoning model. However, that wasn’t the only appealing thing.
**Personal finance** is the other area I wanted to improve but couldn’t easily do**.** Since my first salary credit, I have made many absurd financial choices. Be it in saving, emergency funds, insurance, investing, etc. I never had the proper education regarding the questions. The subreddit `r/personalfinance` and `r/personalfinanceindia` were godsend in these cases. Any questions I had were answered by the communities there. However, more often than not, my posts never had any replies, and I lost the opportunity to make a few decisions. Hence, I realised that a chatbot trained specifically for this purpose might not be bad.
## Which of these is least explored?
Well, the answer was quite straightforward. It’s Personal Finance. Psychology had many LLMs and datasets curated for their purposes. However, personal finance is an interdisciplinary topic that requires a finance degree and some psychology background. Why? Well, any financial choice is an emotional decision as much as a logical one. Hence, it’s rarely explored.
## But wait…Why choose something that’s least explored?
There are multiple answers to this question. But here are the three main reasons I chose the least explored ones.
1.  Any data scientist who worked for at least 1 month in the practical world would know that the real-world applications are not forgiving. They are ridden with too many inconsistencies and logical flaws, and most importantly, they’re not easily structured. The easiest way to get comfortable with these is by tackling them head-on.
2.  I do not need to write an article on the generally explored topics. I could read the amazing articles and experiments the community has done. But, the one thing that’d benefit me (and probably you) is to find the areas where things are missing and try contributing to filling those gaps.
3.  I wish I had this article available. Since I couldn’t find one, I had to make one.
## 2\. What is available on the World Wide Web?
The second step in dataset creation is scraping and gathering the dataset. However, where can I even find questions and answers about personal finance? What are the requirements for these questions?
Well, after a lot of deliberation, these were the few requirements I realised,
1. The questions must be scenario-based rather than generic, like: “_Why should one save money_?”.
2. They should contain as little PII as possible with most of the query-related information present.
3. They should not have straightforward answers and need complex reasoning and understanding to achieve optimal solutions.
Now, there’s only one place where I can find data that satisfies these three requirements. That was also the place I frequented very often. It’s none other than **_Reddit_**!
However, I don’t officially have academic access to scrape data from Reddit. So, I had to look for the latest Reddit scrapes on Kaggle and other places. Luckily, there was one such place on Kaggle. It was a dataset provided by Dataset Expert [Leukipp](https://www.kaggle.com/leukipp). You can find it [here](https://www.kaggle.com/datasets/leukipp/reddit-finance-data).
## What artefacts are missing here?
Well, the data now has the category of the request (from `link_flair_text`), the post title, and the description. However, we don't have access to the responses each user had obtained. So, we're now missing two things,
1. The correct answer to the question.
2. The reasoning behind the answer.
The challenge has shifted from finding the starting point to finding what to do next.
## What happened to the unforgiving “real-world” data? You’re once again using the Kaggle dataset here!
Well, the answer is half-right and half-wrong. I am indeed using a readily available dataset. However, the reason is the lack of access to the Reddit API. Once I access that, you’ll find an article titled “Reasoning Models #2.5” out here.
Also, the dataset shown is only partially cleaned. It still has duplicate entries, missing category flags, and many more tiny issues. I’m, however, skipping the explanation on these steps, as it’s more structured to have it in the 2.5 article. After processing and filtering the available data, the final dataset is 54.2K unique questions in the `r/personal_finance` dataset.
And it's now time to generate the answers for these 54.2k questions. How do we do that?
## 3\. Steps in generating the dataset
This was a confusing section to me. Ideally, when budget and other things are discarded, hiring a few SMEs and asking them to answer all the 50k+ questions in at least 2–3 different ways is best. Since that’s impossible, the next step is to ask them to answer 1k-10k questions and use those responses to generate the answers for the rest of the dataset.
However, in our case, that’s not even possible. Not because we’re unwilling to do that but because we don’t have the budget. So, what’s the next thing that we can do? Well, we’ll have to replace the SMEs with their LLM counterparts. Now, the challenge is to identify these LLMs. What are the requirements for these LLMs? What corpus should they be finetuned on?
## Listing the Requirements for Personal Finance
Personal finance is an interesting field because it’s not limited to Finance. Rather, it’s a blend of Psychology and Finance. Why? Well, the answer is simple. Personal finance is an emotional game. Every one of us knows fundamentally that saving is key to building wealth. But very few of us act upon that knowledge.
Acting upon that knowledge is useless unless one understands and tries to tackle one’s inherent biases. Everyone, almost always, forms a story behind their actions. They might be remotely logical but still form a story to convince themselves. (The first chapter of “Psychology of Money” deals with this topic. Refer to that if you’d like to think more.)
Now that we know the requirements, we must find a model trained to combine these two datasets. Or, we need to find a dataset with both aspects. Luckily, there’s an already available dataset with these topics in mind.
## a. Getting the Answers: Plutus-v2 and the Llama-3.2–1B model.
In my search, I stumbled upon the [Plutus-v2](https://huggingface.co/datasets/0xroyce/Plutus-v2?row=0) dataset. This dataset has around 108k + data points from a comprehensive collection of more than 390 books in Finance, Economics and Psychology categories. Each data point analyses the finance and psychology behind the trader’s behaviour in a specific scenario.
Now, we need a model tuned into this dataset to generate answers to our questions from Reddit. So, it’s time to write some code.
### Steps in Fine-tuning a small Llama model:
1.  We load the dataset using the datasets library. Of course, you can download the 200MB Jsonl file and load it directly using `pandas` or `polars`.
`from datasets import load_dataset ds = load_dataset("0xroyce/Plutus-v2")`
Dataset loading code.
1.  We load the model using the transformers and the unsloth library. What’s `unsloth` you ask? For now, think of it as a module similar to huggingface transformers that have added additional lines of code to make the training process faster. (We'll probably get back to that topic in the future articles sooner than I think.)
```
import torch
from trl import SFTTrainer
from datasets import load_dataset
from transformers import TrainingArguments, TextStreamer
from unsloth.chat_templates import get_chat_template
from unsloth import FastLanguageModel, is_bfloat16_supported
```
```
max_seq_length = 2048
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Llama-3.2-1B-bnb-4bit",
    max_seq_length=max_seq_length,
    load_in_4bit=True,
    dtype=None,
)
```
1.  I have very limited resources on my PC, so I can’t perform full fine-tuning. I can, however, use LoRA to train only a tiny portion of the weights and fuse it with the overall model for better performance. Since we need to get as close to the original fine-tuning as possible, let’s target all the projection layers in the transformer block.
```
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    lora_alpha=16,
    lora_dropout=0,
    target_modules=["q_proj", "k_proj", "v_proj", "up_proj", "down_proj", "o_proj", "gate_proj"], 
    use_rslora=True,
    use_gradient_checkpointing="unsloth"
)
```
```
# Let's verify the trainable parameters
print(model.print_trainable_parameters())
```
1.  Following the initialisation, the data must be formatted into the model- an acceptable template to consolidate the input-output pattern.
```
data_prompt = f"""{}
```
```
### Input:
{}### Response:
{}"""EOS_TOKEN = tokenizer.eos_token
def formatting_prompt(examples):
    inputs       = examples["Context"]
    outputs      = examples["Response"]
    texts = []
    for input_, output in zip(inputs, outputs):
        text = data_prompt.format(input_, output) + EOS_TOKEN
        texts.append(text)
    return { "text": texts, }
dataset = dataset.map(formatting_prompt, batched=True)
```
1.  Finally, we can start the training using the generic `training_args` and `SFTTrainer`.
```
args=TrainingArguments(
        learning_rate=3e-4,
        lr_scheduler_type="linear",
        per_device_train_batch_size=16,
        gradient_accumulation_steps=8,
        num_train_epochs=40,
        fp16=not is_bfloat16_supported(),
        bf16=is_bfloat16_supported(),
        logging_steps=1,
        optim="adamw_8bit",
        weight_decay=0.01,
        warmup_steps=10,
        output_dir="output",
        seed=0,
    )
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=training_data,
    dataset_text_field="text",
    max_seq_length=max_seq_length,
    dataset_num_proc=2,
    packing=True,
    args=args
    )
trainer.train()
```
Of course, you’d have to fine-tune the entire model without using LoRA for better performance. Why? You can refer to this [paper](https://arxiv.org/abs/2405.09673), which proves that the knowledge gained from LoRA tuning is low.
## b. Why should we do this? Why should we use the outputs as answers?
Well, Let me present the hypothesis in simple terms. We’re trying to mimic the process in which an expert answers general questions. To answer these questions,
1.  He’d have to acquire generic foundational knowledge in finance and psychology.
2.  Understand the context of the new question we’re asking.
3.  Use the foundational knowledge to answer the new question.
We’re trying to approximate this process by using the generic knowledge from the Plutus-v2 dataset to find the correct answers to our questions. Of course, technically, we’re trying to change the final output probability values to remain in the desired domain. We’re only assuming that these answers would answer our questions correctly.
Since this is still an assumption, we won’t get a single output and leave with it. We will repeat each experiment `n` (3 for this experiment) times, hoping that the average context of these responses will be relevant to our question.
P.S. Ideally, if you have the compute, choose a higher parameter model for this, too! I have chosen the 8B model to get a fast, rudimentary dataset, which I can improve upon with time.
## c. The next steps — The crux of the whole dataset.
Now, it’s time to generate the main part of the dataset — the Chain-of-Thought responses. There are multiple ways to do this.
1.  We can first tune a DeepSeek-like reasoning model with finance data and then use the reasonings we get.
2.  We can also use the high-parameter reasoning models and prompt engineering to get the approximate reasoning outputs.
The technically “correct” way to do this is the first path, where we’d have first to get a financial reasoning model and then use the 1B model outputs to direct the reasoning model’s outputs. However, we’re working with a very low budget. So, we can’t do that.
Hence, we’re following the second approach. And from my experience, this approach has also provided a decent-quality chain-of-thought response. And what should we choose? Since we aren’t fine-tuning the model and only using it for inference, we can go to high parameter counts, i.e., up to 20B. However, surprisingly, we don’t have 20B models.
The closest ones we can work comfortably are the 14B models. Hence, I’m choosing `DeepSeek-R1-Distill-Qwen-14B` for the next steps. Of course, we're not directly using that; we're using the 4-bit version from unsloth. `unsloth/DeepSeek-R1-Distill-Qwen-14B-unsloth-bnb-4bit`.
Of course, we have an even easier alternative for inference. That’d be using `Ollama`. But setting it up on Kaggle is a pain, so I'm avoiding it now.
### Loading and inferring from the model.
Loading the model from unsloth is as simple as we had previously done.
-   **Step 1:** Load the model and tokeniser
```
from unsloth import FastLanguageModel
from unsloth.chat_templates import get_chat_template
import torch
```
```
max_seq_length = 2048 
dtype = None 
load_in_4bit = True  emodel, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/DeepSeek-R1-Distill-Qwen-14B", 
    max_seq_length=max_seq_length,  
    dtype=dtype,  
    load_in_4bit=load_in_4bit 
)
```
-   **Step 2:** Apply chat-template and prepare the model for inference using `FastLanguageModel.for_inference()`
```
tokenizer = get_chat_template(
    tokenizer,
    chat_template = "qwen-2.5",
)
FastLanguageModel.for_inference(model)
```
-   **Step 3:** Create a clear message from our data points and transform them into the inference model’s chat template.
```
message_format={
  "role": "user",
  "content": """ Answer the user's questions to support their personal finance decisions. Avoid focusing on any PII unrelated to the user's actual problem. Utilise the sample responses to direct your responses.
```
```
### Question:
{}### Sample Response-1:
{}### Sample Response-1:
{}### Sample Response-1:
{}### Output:
"""
}#format the messages so using the message_format before this line.
messages = #formatted using the template
inputs = tokenizer.apply_chat_template(
   messages,
   tokenize=True,  
   add_generation_prompt=True,  
   return_tensors="pt", 
   padding=True,
).to("cuda")
```
-   **Step 4:** Well, we only have to start the inference now. There’s nothing else we can do.
```
attention_mask = inputs != tokenizer.pad_token_id
```
```
outputs = model.generate(
   input_ids=inputs,
   attention_mask=attention_mask, 
   max_new_tokens=64,  
   use_cache=True, 
   temperature=0.6, 
   min_p=0.1,
)text = tokenizer.decode(outputs[0], skip_special_tokens=True)
```
## d. Compute and other orchestration details.
The 14B distilled model needed 14GB of memory during my runs. The problem with this number is that it’s easily available yet not at all flexible. Luckily, I used T4x2 GPUs offered by Kaggle. These offered significant space enough for the model to run without any issues. (I haven’t tried loading it into a single T4 on Colab, but I don’t want to try that…)
Now everything’s fine. Right? Well…No.
An unforeseen problem in this exercise is that each inference took roughly 15 seconds. With 54k samples, even with batching, the speed was very slow. An estimated 112 hours were needed to get the outputs of my entire dataset.
I could never run this on Kaggle. Especially when each save version had roughly 8 hours of run time and each week had roughly 30 hours of GPU time. So, for now, I’m working on getting a `V 0.1.0`, which contains only 5.6K samples this week.
With that as the starting point, I will slowly update it on the HuggingFace Hub. I’d love nothing more than to be a contributor to this project. Especially because I will keep improving this one for next year; if you’re interested, please get in touch with me!
## Areas of Improvement
Of course, you should have identified many areas for improvement throughout this process. Here are a few weak links that can drastically impact the final performance.
1.  Using the highly upvoted Reddit response will guide the overall CoT and Answer generation process instead of assuming that the tuned models can approximate the true answers.
2.  Tuning a larger model instead of the 1B model. This can be anything from Llama-3.2–8/14B models or Gemma/GPT models. I’m using Llama-3.2–1B purely for fun. Heck, the creators of Plutus have directly offered 8B models trained on their dataset. We can also use them.
3.  Using a larger reasoning model to generate better answers.
4.  Getting a small, human-annotated dataset (as mentioned earlier) to direct the answers for the 54K dataset.
5.  Enriching the dataset with various data points from different subreddits like r/options, r/Wallstreetbets, etc.
If you notice, all these obvious improvement points never cared about the “Chain of thought”. Why? That’s because RL-tuning the model never cares about the GT CoT. Rather, it’s more important to get the correct and sensible output, with the CoT having the correct set of tokens to increase the probability of reaching the sensible output.
## Next steps in Developing the Dataset.
As you can imagine, this is a rudimentary way to build a dataset. The output from this might or might not match the quality desired by the end customer. So, what can we do?
## 1\. Evaluate the quality.
Now, this is a significantly difficult task compared to the generation. To achieve this, I must hire an SME or become an expert. However, that only applies if we intend to evaluate this manually. Rather, I plan to stand on the open-source shoulders and get the best decision-making for Financial LLM from the [Open-FinLLM leaderboard](https://huggingface.co/spaces/finosfoundation/Open-Financial-LLM-Leaderboard). Using that as the evaluator, I need to get a score for each response in the corpus.
**How do I get the score?**
Well, the naive way is to repeatedly pass the same input to the model and get the average of the \`Good: Bad\` ratio as a score based on the categorical responses of the LLM. However, I need to think of a more creative way to get this score. Of course, I’ll share what I do on a different day.
## 2\. Use RAG with Complex models for better accuracy
No matter how good the model is finetuned, its general performance is often worse than the performance of the proprietary models. Especially the recent ones like Deepseek-v3–0324 or Gemini 2.5 pro. I have created the next version of this dataset using these models, including rigorous evaluations and better completeness. You can find the full dataset [here](https://huggingface.co/datasets/Akhil-Theerthala/Personal-Finance-Queries).
## 3\. Use this reasoning data to train an intermediary model
Like DeepSeek-R1’s training regime, this process also needs an intermediary reasoning model trained on the existing knowledge data, followed by further alignment. The outputs for the model would then update the current data (50k+) that I have developed.
Of course, those new datasets won’t consist of even a single query shared today. I want to avoid any possible data leakages and other related issues.
With that, I’ll end today’s summary. This is one of the longest articles I’ve ever written, and it is roughly 3000 words long. However, this was also one of the best articles I’ve enjoyed writing.
Now that the dataset has been created, our next task, ideally, is to fine-tune the reasoning model (or) create an entirely new one based on Gemma/Llama. I still haven’t decided what path to follow, but I’ll enjoy playing with the latter approach.
I hope you’ve gained some value from this article. I’d be glad to hear your opinions and suggestions on this article. Hope to meet you again! ✌️