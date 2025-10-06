from huggingface_hub import HfApi, model_info, dataset_info

self_model_names = [
    "Akhil-Theerthala/Kuvera-8B-qwen3-v0.2.1",
    "Akhil-Theerthala/Kuvera-4B-unsloth-gemma3",
    "Akhil-Theerthala/kuvera-12B-v0.2.0-unsloth-gemma3",
    "Akhil-Theerthala/Kuvera-8B-v0.1.0",
    "Akhil-Theerthala/Kuvera-14B-v0.1.0",
]
community_model_names = [
    "mradermacher/Kuvera-8B-v0.1.0-GGUF",
    "mradermacher/Kuvera-14B-v0.1.0-GGUF",
    "mradermacher/Kuvera-14B-v0.1.0-i1-GGUF",
    "mradermacher/Kuvera-8B-v0.1.0-i1-GGUF",
    "bartowski/Akhil-Theerthala_Kuvera-8B-v0.1.0-GGUF",
    "mradermacher/Kuvera-8B-qwen3-v0.2.1-GGUF",
    "mradermacher/Kuvera-8B-qwen3-v0.2.1-i1-GGUF"
]
api = HfApi()
datasets = api.list_datasets(author="Akhil-Theerthala")


self_model_downloads = 0
self_model_likes = 0   
community_model_downloads = 0
community_model_likes = 0
dataset_downloads = 0
dataset_likes = 0


for model_name in self_model_names:
    info = model_info(model_name, expand = ["downloadsAllTime", "likes"])
    self_model_downloads += info.downloads_all_time
    self_model_likes += info.likes

for model_name in community_model_names:
    info = model_info(model_name, expand = ["downloadsAllTime", "likes"])
    community_model_downloads += info.downloads_all_time
    community_model_likes += info.likes

for dataset_name in datasets:
    info = dataset_info(dataset_name.id, expand = ["downloadsAllTime", "likes"])
    dataset_downloads += info.downloads_all_time
    dataset_likes += info.likes
    print(f"Dataset: {dataset_name.id}, Downloads: {info.downloads_all_time}, likes: {info.likes}")


print(f"Self Models: Downloads: {self_model_downloads}, Likes: {self_model_likes}")
print(f"Community Models: Downloads: {community_model_downloads}, Likes: {community_model_likes}")
print(f"Datasets: Downloads: {dataset_downloads}, Likes: {dataset_likes}")

print(f"Total self downloads: {self_model_downloads + dataset_downloads}, Total self likes: {self_model_likes + dataset_likes}")