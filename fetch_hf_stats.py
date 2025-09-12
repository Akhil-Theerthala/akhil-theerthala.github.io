#!/usr/bin/env python3
"""
Script to fetch HuggingFace datasets and models statistics
"""
import json
import urllib.request
import urllib.parse
from urllib.parse import urljoin

# HuggingFace API endpoints
HF_BASE_URL = "https://huggingface.co/api/"
USERNAME = "akhil-theerthala"

def fetch_json(url):
    """Helper function to fetch JSON data from URL"""
    try:
        with urllib.request.urlopen(url) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def fetch_user_models():
    """Fetch all models by the user"""
    url = urljoin(HF_BASE_URL, f"models?author={USERNAME}")
    return fetch_json(url) or []

def fetch_user_datasets():
    """Fetch all datasets by the user"""
    url = urljoin(HF_BASE_URL, f"datasets?author={USERNAME}")
    return fetch_json(url) or []

def get_model_stats(model_id):
    """Get detailed stats for a specific model"""
    url = urljoin(HF_BASE_URL, f"models/{model_id}")
    data = fetch_json(url)
    if data:
        return {
            'id': model_id,
            'downloads': data.get('downloads', 0),
            'likes': data.get('likes', 0),
            'tags': data.get('tags', []),
            'pipeline_tag': data.get('pipeline_tag', ''),
            'created_at': data.get('created_at', ''),
            'last_modified': data.get('last_modified', '')
        }
    return None

def get_dataset_stats(dataset_id):
    """Get detailed stats for a specific dataset"""
    url = urljoin(HF_BASE_URL, f"datasets/{dataset_id}")
    data = fetch_json(url)
    if data:
        return {
            'id': dataset_id,
            'downloads': data.get('downloads', 0),
            'likes': data.get('likes', 0),
            'tags': data.get('tags', []),
            'created_at': data.get('created_at', ''),
            'last_modified': data.get('last_modified', '')
        }
    return None

def main():
    print("Fetching HuggingFace statistics for akhil-theerthala...")
    
    # Fetch models
    print("Fetching models...")
    models = fetch_user_models()
    model_stats = []
    total_model_downloads = 0
    total_model_likes = 0
    
    for model in models:
        model_id = model['id']
        stats = get_model_stats(model_id)
        if stats:
            model_stats.append(stats)
            total_model_downloads += stats['downloads']
            total_model_likes += stats['likes']
    
    # Fetch datasets
    print("Fetching datasets...")
    datasets = fetch_user_datasets()
    dataset_stats = []
    total_dataset_downloads = 0
    total_dataset_likes = 0
    
    for dataset in datasets:
        dataset_id = dataset['id']
        stats = get_dataset_stats(dataset_id)
        if stats:
            dataset_stats.append(stats)
            total_dataset_downloads += stats['downloads']
            total_dataset_likes += stats['likes']
    
    # Compile results
    results = {
        'models': {
            'count': len(model_stats),
            'total_downloads': total_model_downloads,
            'total_likes': total_model_likes,
            'details': model_stats
        },
        'datasets': {
            'count': len(dataset_stats),
            'total_downloads': total_dataset_downloads,
            'total_likes': total_dataset_likes,
            'details': dataset_stats
        },
        'overall': {
            'total_downloads': total_model_downloads + total_dataset_downloads,
            'total_likes': total_model_likes + total_dataset_likes,
            'total_repos': len(model_stats) + len(dataset_stats)
        }
    }
    
    # Save to JSON file
    with open('hf_stats.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\nSummary:")
    print(f"Models: {results['models']['count']} (Downloads: {results['models']['total_downloads']}, Likes: {results['models']['total_likes']})")
    print(f"Datasets: {results['datasets']['count']} (Downloads: {results['datasets']['total_downloads']}, Likes: {results['datasets']['total_likes']})")
    print(f"Total Downloads: {results['overall']['total_downloads']}")
    print(f"Total Likes: {results['overall']['total_likes']}")
    print(f"Results saved to hf_stats.json")

if __name__ == "__main__":
    main()