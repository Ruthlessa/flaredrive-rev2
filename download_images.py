import requests
import os
import time
from tqdm import tqdm

def download_random_images(num_images=1000, output_dir='/workspace/images'):
    base_url = 'https://www.dmoe.cc/random.php'
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    success_count = 0
    failed_count = 0
    
    for i in tqdm(range(num_images), desc='下载进度'):
        try:
            response = requests.get(base_url, timeout=10)
            response.raise_for_status()
            
            content_type = response.headers.get('Content-Type', '')
            ext = 'jpg'
            if 'png' in content_type:
                ext = 'png'
            elif 'gif' in content_type:
                ext = 'gif'
            elif 'webp' in content_type:
                ext = 'webp'
            
            filename = f'image_{i+1:04d}.{ext}'
            filepath = os.path.join(output_dir, filename)
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            success_count += 1
            time.sleep(0.1)
            
        except Exception as e:
            print(f'\n下载第 {i+1} 张图片时出错: {e}')
            failed_count += 1
            continue
    
    print(f'\n下载完成!')
    print(f'成功: {success_count} 张')
    print(f'失败: {failed_count} 张')
    print(f'图片保存在: {output_dir}')

if __name__ == '__main__':
    download_random_images()
