#!/usr/bin/env python3
"""
Get accurate HuggingFace download statistics using the correct API endpoints
"""
import json
import urllib.request
import urllib.parse
import os

def make_authenticated_request(url, token=None):
    """Make authenticated request to HuggingFace API"""
    headers = {
        'User-Agent': 'Python/urllib'
    }
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code} for {url}")
        if hasattr(e, 'read'):
            print(f"Error details: {e.read().decode()}")
        return None
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def get_user_models(username, token=None):
    """Get all models by user using correct API endpoint"""
    url = f"https://huggingface.co/api/models?author={username}&limit=100&full=true"
    print(f"Fetching models from: {url}")
    return make_authenticated_request(url, token)

def get_user_datasets(username, token=None):
    """Get all datasets by user using correct API endpoint"""
    url = f"https://huggingface.co/api/datasets?author={username}&limit=100&full=true"
    print(f"Fetching datasets from: {url}")
    return make_authenticated_request(url, token)

def get_model_details(model_id, token=None):
    """Get detailed model information including downloads"""
    url = f"https://huggingface.co/api/models/{model_id}"
    print(f"Fetching model details: {url}")
    return make_authenticated_request(url, token)

def get_dataset_details(dataset_id, token=None):
    """Get detailed dataset information including downloads"""
    url = f"https://huggingface.co/api/datasets/{dataset_id}"
    print(f"Fetching dataset details: {url}")
    return make_authenticated_request(url, token)

def main():
    username = "akhil-theerthala"
    token = os.getenv('HF_API_KEY')
    
    print(f"Getting HuggingFace statistics for: {username}")
    if token:
        print("Using provided API token")
    else:
        print("No API token provided - using public API")
    
    print("\n" + "="*60)
    print("FETCHING MODELS")
    print("="*60)
    
    # Get user models
    models = get_user_models(username, token)
    model_data = []
    total_model_downloads = 0
    total_model_likes = 0
    
    if models:
        print(f"Found {len(models)} models")
        for model in models:
            model_id = model.get('id', 'unknown')
            print(f"\nProcessing: {model_id}")
            
            # Get detailed model info
            details = get_model_details(model_id, token)
            if details:
                downloads = details.get('downloads', 0)
                likes = details.get('likes', 0)
                
                model_info = {
                    'id': model_id,
                    'downloads': downloads,
                    'likes': likes,
                    'tags': details.get('tags', []),
                    'pipeline_tag': details.get('pipeline_tag', ''),
                    'created_at': details.get('created_at', ''),
                    'last_modified': details.get('last_modified', '')
                }
                
                model_data.append(model_info)
                total_model_downloads += downloads
                total_model_likes += likes
                
                print(f"  Downloads: {downloads:,}")
                print(f"  Likes: {likes}")
            else:
                print(f"  Could not get details for {model_id}")
    else:
        print("No models found or error occurred")
    
    print("\n" + "="*60)
    print("FETCHING DATASETS")
    print("="*60)
    
    # Get user datasets
    datasets = get_user_datasets(username, token)
    dataset_data = []
    total_dataset_downloads = 0
    total_dataset_likes = 0
    
    if datasets:
        print(f"Found {len(datasets)} datasets")
        for dataset in datasets:
            dataset_id = dataset.get('id', 'unknown')
            print(f"\nProcessing: {dataset_id}")
            
            # Get detailed dataset info
            details = get_dataset_details(dataset_id, token)
            if details:
                downloads = details.get('downloads', 0)
                likes = details.get('likes', 0)
                
                dataset_info = {
                    'id': dataset_id,
                    'downloads': downloads,
                    'likes': likes,
                    'tags': details.get('tags', []),
                    'created_at': details.get('created_at', ''),
                    'last_modified': details.get('last_modified', '')
                }
                
                dataset_data.append(dataset_info)
                total_dataset_downloads += downloads
                total_dataset_likes += likes
                
                print(f"  Downloads: {downloads:,}")
                print(f"  Likes: {likes}")
            else:
                print(f"  Could not get details for {dataset_id}")
    else:
        print("No datasets found or error occurred")
    
    # Calculate totals
    grand_total_downloads = total_model_downloads + total_dataset_downloads
    grand_total_likes = total_model_likes + total_dataset_likes
    
    # Compile results
    results = {
        'timestamp': '2025-09-12',
        'username': username,
        'models': {
            'count': len(model_data),
            'total_downloads': total_model_downloads,
            'total_likes': total_model_likes,
            'details': model_data
        },
        'datasets': {
            'count': len(dataset_data),
            'total_downloads': total_dataset_downloads,
            'total_likes': total_dataset_likes,
            'details': dataset_data
        },
        'totals': {
            'total_downloads': grand_total_downloads,
            'total_likes': grand_total_likes,
            'total_repositories': len(model_data) + len(dataset_data)
        }
    }
    
    # Save results
    with open('hf_downloads_real.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\n" + "="*60)
    print("FINAL STATISTICS")
    print("="*60)
    print(f"Models: {len(model_data)}")
    print(f"  Total Downloads: {total_model_downloads:,}")
    print(f"  Total Likes: {total_model_likes:,}")
    print(f"\nDatasets: {len(dataset_data)}")
    print(f"  Total Downloads: {total_dataset_downloads:,}")
    print(f"  Total Likes: {total_dataset_likes:,}")
    print(f"\nGRAND TOTALS:")
    print(f"  Total Downloads: {grand_total_downloads:,}")
    print(f"  Total Likes: {grand_total_likes:,}")
    print(f"  Total Repositories: {len(model_data) + len(dataset_data)}")
    print(f"\nResults saved to: hf_downloads_real.json")

if __name__ == "__main__":
    main()