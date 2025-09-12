#!/usr/bin/env python3
"""
Get HuggingFace download stats by scraping public pages
"""
import re
import urllib.request
import urllib.parse

def get_page_content(url):
    """Get webpage content"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_downloads_from_page(content, model_name):
    """Extract download count from HF page content"""
    if not content:
        return 0
    
    # Look for download patterns in the HTML
    patterns = [
        r'(\d+(?:,\d+)*)\s*downloads?',
        r'downloads?\s*[:\-]?\s*(\d+(?:,\d+)*)',
        r'Downloaded\s*(\d+(?:,\d+)*)',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            # Return the largest number found (likely the total downloads)
            numbers = [int(match.replace(',', '')) for match in matches]
            return max(numbers)
    
    return 0

def get_model_downloads(model_name):
    """Get download count for a specific model"""
    url = f"https://huggingface.co/akhil-theerthala/{model_name}"
    content = get_page_content(url)
    downloads = extract_downloads_from_page(content, model_name)
    print(f"{model_name}: {downloads} downloads")
    return downloads

def get_dataset_downloads(dataset_name):
    """Get download count for a specific dataset"""
    url = f"https://huggingface.co/datasets/akhil-theerthala/{dataset_name}"
    content = get_page_content(url)
    downloads = extract_downloads_from_page(content, dataset_name)
    print(f"{dataset_name}: {downloads} downloads")
    return downloads

def main():
    print("Getting accurate HuggingFace download statistics...")
    
    # Known models from our research
    models = [
        "Kuvera-8B",
        "Kuvera-4B", 
        "Kuvera-12B",
        "Kuvera-14B"
    ]
    
    # Known datasets
    datasets = [
        "PersonalFinance_v2"
    ]
    
    print("\n=== MODELS ===")
    model_downloads = {}
    for model in models:
        downloads = get_model_downloads(model)
        if downloads > 0:
            model_downloads[model] = downloads
    
    print("\n=== DATASETS ===")
    dataset_downloads = {}
    for dataset in datasets:
        downloads = get_dataset_downloads(dataset)
        if downloads > 0:
            dataset_downloads[dataset] = downloads
    
    total_model_downloads = sum(model_downloads.values())
    total_dataset_downloads = sum(dataset_downloads.values())
    total_downloads = total_model_downloads + total_dataset_downloads
    
    print(f"\n=== SUMMARY ===")
    print(f"Total Model Downloads: {total_model_downloads:,}")
    print(f"Total Dataset Downloads: {total_dataset_downloads:,}")
    print(f"Grand Total Downloads: {total_downloads:,}")
    
    # Save results
    results = {
        'models': model_downloads,
        'datasets': dataset_downloads,
        'totals': {
            'model_downloads': total_model_downloads,
            'dataset_downloads': total_dataset_downloads,
            'total_downloads': total_downloads
        }
    }
    
    with open('real_hf_stats.txt', 'w') as f:
        f.write(f"ACCURATE HUGGINGFACE DOWNLOAD STATS\n")
        f.write(f"===================================\n\n")
        f.write(f"MODELS:\n")
        for model, downloads in model_downloads.items():
            f.write(f"  {model}: {downloads:,} downloads\n")
        f.write(f"\nDATASETS:\n")
        for dataset, downloads in dataset_downloads.items():
            f.write(f"  {dataset}: {downloads:,} downloads\n")
        f.write(f"\nTOTALS:\n")
        f.write(f"  Total Downloads: {total_downloads:,}\n")
        f.write(f"  Model Downloads: {total_model_downloads:,}\n")
        f.write(f"  Dataset Downloads: {total_dataset_downloads:,}\n")
    
    print(f"\nResults saved to real_hf_stats.txt")
    
    return results

if __name__ == "__main__":
    main()