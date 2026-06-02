import time
import os
import undetected_chromedriver as uc

def download_images_with_selenium():
    options = uc.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    options.add_argument('--disable-blink-features=AutomationControlled')
    
    driver = uc.Chrome(options=options)
    
    success_count = 0
    failed_count = 0
    failed_list = []
    
    try:
        for i in range(1, 101):
            try:
                url = f'https://ask.mcaq.us.ci/image_{i:04d}.jpg'
                driver.get(url)
                
                time.sleep(3)
                
                current_url = driver.current_url
                
                if current_url.startswith('https://ask.mcaq.us.ci/image_'):
                    success_count += 1
                    print(f'成功: image_{i:04d}.jpg')
                else:
                    page_source = driver.page_source
                    if 'security verification' in page_source.lower() or 'cloudflare' in page_source.lower():
                        failed_count += 1
                        failed_list.append(f'{i:04d}')
                        print(f'被拦截: image_{i:04d}.jpg')
                    else:
                        success_count += 1
                        print(f'成功: image_{i:04d}.jpg')
                
                time.sleep(1)
                
            except Exception as e:
                failed_count += 1
                failed_list.append(f'{i:04d}')
                print(f'错误: image_{i:04d}.jpg - {str(e)[:50]}')
                continue
                
    finally:
        driver.quit()
    
    print(f'\n访问完成!')
    print(f'成功: {success_count} 个')
    print(f'失败: {failed_count} 个')
    
    if failed_list:
        print(f'\n失败的图片编号: {", ".join(failed_list[:20])}' + ('...' if len(failed_list) > 20 else ''))

if __name__ == '__main__':
    download_images_with_selenium()
