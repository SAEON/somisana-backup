def build(module_parser):
    mhw = module_parser.add_parser("mhw", help="Marine Heat Waves (MHW) module")
    mhw_parser = mhw.add_subparsers(
        title="Marine Heat Waves (MHW)",
        description="Look for high normal variance of SST compared to the previous decades",
        dest="mhw_command",
        metavar="Available commands",
    )

    # Start
    mhw_start = mhw_parser.add_parser("start", help="Track marine heat waves from daily data")
    mhw_start.add_argument(
        "--nc-output-path", default=".output.nc", help="Path of NetCDF output path"
    )
    
    return mhw
