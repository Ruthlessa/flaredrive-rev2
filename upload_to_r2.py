import boto3
import os
from tqdm import tqdm

def upload_to_r2():
    endpoint_url = 'https://ac29c5487415c7635b337efd8abf4de6.r2.cloudflarestorage.com'
    access_key_id = '0d5bc23fa8b4ad2891776a9bbe76a217'
    secret_access_key = '53264aebd1d6e30817fcc0dcde4d62e039727883a6a8ea640b3923c24f4a0df0'
    bucket_name = 'r2-explorer-bucket'
    source_dir = '/workspace/images'
    
    s3 = boto3.client(
        's3',
        endpoint_url=endpoint_url,
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
        region_name='us-east-1'
    )
    
    if not os.path.exists(source_dir):
        print(f'错误: 目录 {source_dir} 不存在')
        return
    
    files = [f for f in os.listdir(source_dir) if os.path.isfile(os.path.join(source_dir, f))]
    
    if not files:
        print(f'错误: 目录 {source_dir} 中没有文件')
        return
    
    print(f'找到 {len(files)} 个文件，准备上传到 R2...')
    
    success_count = 0
    failed_count = 0
    
    for filename in tqdm(files, desc='上传进度'):
        try:
            filepath = os.path.join(source_dir, filename)
            
            content_type = 'image/jpeg'
            if filename.lower().endswith('.png'):
                content_type = 'image/png'
            elif filename.lower().endswith('.gif'):
                content_type = 'image/gif'
            elif filename.lower().endswith('.webp'):
                content_type = 'image/webp'
            
            with open(filepath, 'rb') as f:
                s3.put_object(
                    Bucket=bucket_name,
                    Key=filename,
                    Body=f,
                    ContentType=content_type
                )
            
            success_count += 1
            
        except Exception as e:
            print(f'\n上传 {filename} 时出错: {e}')
            failed_count += 1
            continue
    
    print(f'\n上传完成!')
    print(f'成功: {success_count} 个文件')
    print(f'失败: {failed_count} 个文件')

if __name__ == '__main__':
    upload_to_r2()
