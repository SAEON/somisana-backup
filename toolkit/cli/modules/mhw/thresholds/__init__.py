import os
from os.path import join
from config import CACHDIR
from cli.modules.mhw.thresholds.catalogue import update_cache
from cli.modules.mhw.thresholds.climatolgy import calculate_daily_clim
from cli.modules.mhw.oisst import Catalogue

MHW_BULK_CACHE = join(CACHDIR, "ohw", "thresholds", "bulk")
OISST_DATA = "https://www.ncei.noaa.gov/thredds/catalog/OisstBase/NetCDF/V2.1/AVHRR"

# Ensure cache directory exists
os.makedirs(MHW_BULK_CACHE, exist_ok=True)


def create_thresholds(args):
    nc_thresholds_path = os.path.abspath(args.nc_thresholds_path)
    domain = [float(x) for x in args.domain.split(",")]
    clear_cache = args.clear_cache
    mhw_bulk_cache = (
        os.path.abspath(args.mhw_bulk_cache) if args.mhw_bulk_cache else MHW_BULK_CACHE
    )
    with Catalogue("{url}/catalog.xml".format(url=OISST_DATA)) as catalogue:
        refs = catalogue.catalog_refs
        update_cache(refs, OISST_DATA, domain, mhw_bulk_cache, clear_cache)
    exit()

    calculate_daily_clim(domain, mhw_bulk_cache, nc_thresholds_path)

    # Download the back SST data
    # Then figure out the logic of updating the cache

    # Download new SST data
    # Generate new thresholds file
