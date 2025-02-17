import os
from pathlib import Path
from datetime import datetime, timedelta
import requests as r
import aiofiles
import aiohttp

url = "https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_0p25_1hr.pl"


def yyyymmdd(dt):
    return dt.strftime("%Y") + dt.strftime("%m") + dt.strftime("%d")


def time_param(dt):
    return yyyymmdd(dt) + "/" + dt.strftime("%H") + "/atmos"


def create_fname(dt, i):
    return yyyymmdd(dt) + dt.strftime("%H") + "_f" + str(i).zfill(3) + ".grb"


def validate_download_or_remove(fileout):
    if Path(fileout).stat().st_size < 1000:
        print(
            "WARNING:", fileout, "< 1kB (flagged as invalid)", open(fileout, "r").read()
        )
        os.remove(fileout)


def set_params(_params, dt, i):
    params = dict(_params)
    params["file"] = "gfs.t{h}{z}{f}".format(
        h=dt.strftime("%H"), z="z.pgrb2.0p25.f", f=str(i).zfill(3)
    )
    params["dir"] = "/gfs.{t}".format(t=time_param(dt))
    return params


async def download_file(semaphore, fname, workdir, params):
    fileout = os.path.join(workdir, fname)
    if not os.path.isfile(fileout):
        async with semaphore:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        print(f"[{now}] Downloading {fileout}")
                        async with aiofiles.open(fileout, mode="wb") as f:
                            async for chunk in response.content.iter_chunked(1024):
                                if chunk:
                                    await f.write(chunk)
                        validate_download_or_remove(fileout)
                    else:
                        print(f"Request failed with status code {response.status}")
    else:
        print("File already exists", fileout)


def get_latest_available_dt(dt):
    latest_available_date = datetime(dt.year, dt.month, dt.day, 18, 0, 0)
    gfs_exists = False
    iters = 0

    while not (gfs_exists):
        if iters > 4:
            print("GFS data is not presently available")
            exit(1)

        dataset_url = (
            "https://nomads.ncep.noaa.gov/dods/gfs_0p25_1hr/gfs"
            + yyyymmdd(latest_available_date)
            + "/gfs_0p25_1hr_"
            + latest_available_date.strftime("%H")
            + "z"
        )

        print("Testing GFS availability", dataset_url)
        result = r.head(dataset_url)
        xdap = result.headers.get("XDAP")

        if xdap:
            print(
                "Latest available GFS initialisation found at",
                dataset_url,
                "\n",
                "X-DAP HTTP Header",
                xdap,
                "\n",
                "\n",
            )
            gfs_exists = True
        else:
            latest_available_date = latest_available_date + timedelta(hours=-6)
            iters += 1

    return latest_available_date
