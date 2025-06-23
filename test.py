import asyncio
import aiohttp
import time

URL = "https://4414-182-253-126-4.ngrok-free.app/predict"  # Ganti dengan URL endpoint yang sesuai
TOTAL_REQUESTS = 1000  # Jumlah total request
CONCURRENT_REQUESTS = 100  # Banyak request paralel dalam 1 batch

payload = {
    "data": "x" * 1000  # Payload besar untuk uji beban
}

headers = {
    "Content-Type": "application/json"
}


async def send_request(session, i):
    try:
        async with session.post(URL, json=payload, headers=headers) as response:
            status = response.status
            text = await response.text()
            print(f"[{i}] Status: {status}, Response: {text[:50]}")
    except Exception as e:
        print(f"[{i}] Error: {e}")


async def bound_post(sem, session, i):
    async with sem:
        await send_request(session, i)


async def run_load_test():
    sem = asyncio.Semaphore(CONCURRENT_REQUESTS)
    async with aiohttp.ClientSession() as session:
        tasks = [bound_post(sem, session, i) for i in range(TOTAL_REQUESTS)]
        start = time.time()
        await asyncio.gather(*tasks)
        end = time.time()
        print(f"\nTotal time: {end - start:.2f} seconds")


if __name__ == "__main__":
    asyncio.run(run_load_test())
