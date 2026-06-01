import botoimport boto3
import os
from tqdm import tqdm

def upload_to_r2():import boto3
import os
from tqdm import tqdm

def upload_to_r2():
    endpoint_url = 'https://ac29c5487415cimport boto3
import os
from tqdm import tqdm

def upload_to_r2():
    endpoint_url = 'https://ac29c5487415c7635b337efd8abf4de6.r2.cloudflimport boto3
import os
from tqdm import tqdm

def upload_to_r2():
    endpoint_url = 'https://ac29c5487415c7635b337efd8abf4de6.r2.cloudflarestorage.com'
    access_key_id = '0d5bc23fa8bimport boto3
import os
from tqdm import tqdm

def upload_to_r2():
    endpoint_url = 'https://ac29c5487415c7635b337efd8abf4de6.r2.cloudflarestorage.com'
    access_key_id = '0d5bc23fa8b4ad2891776a9bbe76a217'
import boto3
import os
from tqdm import tqdm

def upload_to_r2():
    endpoint_url = 'https://ac29c5487415c7635b337efd8abf4de6.r2.cloudflarestorage.com'
    access_key_id = '0d5bc23fa8b4ad2891776a9bbe76a217'
    secret_access_key = '53264aebd1d6e30import boto3
import os
from tqdm import tqdm

def upload_to_r2():
    endpoint_url = 'https://ac29c5487415c7635b337efd8abf4de6.r2.cloudflarestorage.com'
    access_key_id = '0d5bc23fa8b4ad2891776a9bbe76a217'
    secret_access_key = '53264aebd1d6e30817fcc0dcde4d62e0397278import boto3
import os
from tqdm import tqdm

def upload_to_r2():
    endpoint_url = 'https://ac29c5487415c7635b337efd8abf4de6.r2.cloudflarestorage.com'
    access_key_id = '0d5bc23fa8b4ad2891776a9bbe76a217'
    secret_access_key = '53264aebd1d6e30817fcc0dcde4d62e039727883a6a8ea640b3923c24f4import boto3
import os
from tqdm import tqdm

def upload_to_r2():
    endpoint_url = 'https://ac29c5487415c7635b337efd8abf4de6.r2.cloudflarestorage.com'
    access_key_id = '0d5bc23fa8b4ad2891776a9bbe76a217'
    secret_access_key = '53264aebd1d6e30817fcc0dcde4d62e039727883a6a8ea640b3923c24f4a0df0'
    bucket_name = 'r2-explorer-bucket'
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
        aws_access_key_id=import boto3
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
        region_name='import boto3
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
    
    filesimport boto3
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
    
    files = [f for f in os.listdir(source_dir) if os.path.isfile(os.path.join