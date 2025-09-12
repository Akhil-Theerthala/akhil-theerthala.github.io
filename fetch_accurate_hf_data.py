#!/usr/bin/env python3
"""
Fetch accurate HuggingFace data with API authentication
Run with: HF_API_KEY=your_token python3 fetch_accurate_hf_data.py
"""
import json
import os
import urllib.request
import urllib.parse
import urllib.error

def make_api_request(url, headers=None):
    """Make authenticated API request to HuggingFace"""
    try:
        req = urllib.request.Request(url, headers=headers or {})
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code} for {url}: {e.reason}")
        return None
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def get_user_models(username, token=None):
    """Get all models by user with download stats"""
    headers = {}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    url = f"https://huggingface.co/api/models?author={username}&limit=100"
    models = make_api_request(url, headers)
    
    if not models:
        return []
    
    detailed_models = []
    for model in models:
        model_id = model['id']
        model_url = f"https://huggingface.co/api/models/{model_id}"
        details = make_api_request(model_url, headers)
        
        if details:
            detailed_models.append({
                'id': model_id,
                'downloads': details.get('downloads', 0),
                'downloads_all_time': details.get('downloads', 0),  # API returns total downloads
                'likes': details.get('likes', 0),
                'tags': details.get('tags', []),
                'pipeline_tag': details.get('pipeline_tag', ''),
                'created_at': details.get('created_at', ''),
                'last_modified': details.get('last_modified', ''),
                'library_name': details.get('library_name', ''),
                'model_index': details.get('model-index', [])
            })
    
    return detailed_models

def get_user_datasets(username, token=None):
    """Get all datasets by user with download stats"""
    headers = {}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    url = f"https://huggingface.co/api/datasets?author={username}&limit=100"
    datasets = make_api_request(url, headers)
    
    if not datasets:
        return []
    
    detailed_datasets = []
    for dataset in datasets:
        dataset_id = dataset['id']
        dataset_url = f"https://huggingface.co/api/datasets/{dataset_id}"
        details = make_api_request(dataset_url, headers)
        
        if details:
            detailed_datasets.append({
                'id': dataset_id,
                'downloads': details.get('downloads', 0),
                'downloads_all_time': details.get('downloads', 0),
                'likes': details.get('likes', 0),
                'tags': details.get('tags', []),
                'created_at': details.get('created_at', ''),
                'last_modified': details.get('last_modified', ''),
                'size_categories': details.get('size_categories', []),
                'task_categories': details.get('task_categories', [])
            })
    
    return detailed_datasets

def get_user_info(username, token=None):
    """Get user profile information"""
    headers = {}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    url = f"https://huggingface.co/api/users/{username}"
    return make_api_request(url, headers)

def main():
    username = "akhil-theerthala"
    token = os.getenv('HF_API_KEY')
    
    if not token:
        print("Warning: No HF_API_KEY found. Using unauthenticated requests (limited data).")
    
    print("Fetching accurate HuggingFace data...")
    
    # Get user info
    user_info = get_user_info(username, token)
    
    # Get models with accurate download counts
    print("Fetching models...")
    models = get_user_models(username, token)
    
    # Get datasets with accurate download counts
    print("Fetching datasets...")
    datasets = get_user_datasets(username, token)
    
    # Calculate totals
    total_model_downloads = sum(m.get('downloads', 0) for m in models)
    total_dataset_downloads = sum(d.get('downloads', 0) for d in datasets)
    total_model_likes = sum(m.get('likes', 0) for m in models)
    total_dataset_likes = sum(d.get('likes', 0) for d in datasets)
    
    # Compile accurate results
    accurate_data = {
        'user_info': user_info,
        'models': {
            'count': len(models),
            'total_downloads': total_model_downloads,
            'total_likes': total_model_likes,
            'details': models
        },
        'datasets': {
            'count': len(datasets),
            'total_downloads': total_dataset_downloads,
            'total_likes': total_dataset_likes,
            'details': datasets
        },
        'summary': {
            'total_downloads': total_model_downloads + total_dataset_downloads,
            'total_likes': total_model_likes + total_dataset_likes,
            'total_repos': len(models) + len(datasets)
        }
    }
    
    # Save to JSON
    with open('accurate_hf_data.json', 'w') as f:
        json.dump(accurate_data, f, indent=2)
    
    # Print summary
    print(f"\n=== ACCURATE HUGGINGFACE STATS ===")
    print(f"User: {username}")
    print(f"Models: {len(models)} (Downloads: {total_model_downloads:,}, Likes: {total_model_likes})")
    print(f"Datasets: {len(datasets)} (Downloads: {total_dataset_downloads:,}, Likes: {total_dataset_likes})")
    print(f"Total Downloads: {total_model_downloads + total_dataset_downloads:,}")
    print(f"Total Likes: {total_model_likes + total_dataset_likes}")
    
    if models:
        print(f"\nTop Models by Downloads:")
        sorted_models = sorted(models, key=lambda x: x.get('downloads', 0), reverse=True)[:5]
        for model in sorted_models:
            print(f"  • {model['id']}: {model.get('downloads', 0):,} downloads, {model.get('likes', 0)} likes")
    
    if datasets:
        print(f"\nTop Datasets by Downloads:")
        sorted_datasets = sorted(datasets, key=lambda x: x.get('downloads', 0), reverse=True)[:5]
        for dataset in sorted_datasets:
            print(f"  • {dataset['id']}: {dataset.get('downloads', 0):,} downloads, {dataset.get('likes', 0)} likes")
    
    print(f"\nData saved to: accurate_hf_data.json")

if __name__ == "__main__":
    main()