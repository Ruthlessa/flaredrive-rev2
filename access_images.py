import requests
import time
from tqdm import tqdm

def access_images():
    base_url = 'https://ask.mcaq.us.ci/image_{}.jpg'
    
    success_count = 0
    failed_count = 0
    failed_list = []
    
    for i in tqdm(range(1, 1001), desc='访问进度'):
        try:
            url = base_url.format(f'{i:04d}')
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                success_count += 1
            else:
                failed_count += 1
                failed_list.append(f'{i:04d}')
            
            time.sleep(0.1)
            
        except Exception as e:
            failed_count += 1
            failed_list.append(f'{i:04d}')
            continue
    
    print(f'\n访问完成!')
    print(f'成功: {success_count} 个')
    print(f'失败: {failed_count} 个')
    
    if failed_list:
        print(f'\n失败的图片编号: {", ".join(failed_list[:20])}' + ('...' if len(failed_list) > 20 else ''))

if __name__ == '__main__':
    access_images()
