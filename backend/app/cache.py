import redis
import json
import os
from functools import wraps
from datetime import timedelta

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

def cache_response(expire_seconds: int = 60):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Create a unique cache key based on function name, user id (if any), and arguments
            # This is a simplified version
            key_parts = [func.__name__]
            
            # If current_user is in kwargs, add company_id to key for multi-tenancy isolation
            if "current_user" in kwargs:
                key_parts.append(f"company_{kwargs['current_user'].company_id}")
            
            # Add other important kwargs to keys
            for k, v in kwargs.items():
                if k not in ["db", "current_user"]:
                    key_parts.append(f"{k}_{v}")
            
            cache_key = ":".join(key_parts)
            
            # Try to get from cache
            try:
                cached_data = redis_client.get(cache_key)
                if cached_data:
                    return json.loads(cached_data)
            except Exception as e:
                print(f"Redis Error (Get): {e}")

            # If not in cache, call original function
            result = await func(*args, **kwargs)

            # Store in cache
            try:
                redis_client.setex(
                    cache_key,
                    timedelta(seconds=expire_seconds),
                    json.dumps(result, default=str)
                )
            except Exception as e:
                print(f"Redis Error (Set): {e}")

            return result
        return wrapper
    return decorator

def invalidate_company_cache(company_id: int):
    """Utility to clear cache when data is added/updated"""
    try:
        keys = redis_client.keys(f"*:company_{company_id}:*")
        if keys:
            redis_client.delete(*keys)
    except Exception as e:
        print(f"Redis Error (Invalidate): {e}")
