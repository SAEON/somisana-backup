import xarray as xr
import numpy as np
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
from datetime import timedelta, datetime
from config import MODEL_OUTPUT_PATH, MODEL_GRID_PATH


# Rounds to nearest hour by adding a timedelta hour if minute >= 30
def hour_rounder(t):
    return (t.replace(second=0, microsecond=0, minute=0, hour=t.hour)
            + timedelta(hours=t.minute//30))

def transform():
    data = xr.open_dataset(MODEL_OUTPUT_PATH)
    grid = xr.open_dataset(MODEL_GRID_PATH)

    print(data)

    # Lon and lat grids
    lon = grid.lon_rho.values
    lat = grid.lat_rho.values

    # Loading sst from file
    sst = data.surf_t.values
    sst[np.where(sst == 0)] = np.nan

    # print (sst[:,1,1])

    # Flexible max and min
    cmin = np.nanmin(sst)
    cmax = np.nanmax(sst)

    # Number of contour levels
    contour_levels = 25

    # Colormap
    colormap = plt.cm.jet

    # Loading time
    time = data.time.values
    # Time of initialisation hard coded from file
    date_ref = datetime(2000, 1, 1, 0, 0, 0)

    dates = []
    dates_check = []
    for t in time:
        date_now = date_ref + timedelta(seconds=np.float64(t))
        date_round = hour_rounder(date_now)
        dates_check.append(date_round)
        dates.append(date_round.timestamp())

    for step in np.arange(len(sst)):
        frame = sst[step,:,:]
        for eta_rho, frame_x in  enumerate(frame):
            for xi_rho, value in enumerate(frame_x):
                print('step', step, 'timestamp', data.surf_t.time[step].values)
                print('x (I think)', 'convert to gps', eta_rho)
                print('y (I think)', 'convert to gps', xi_rho)
                print('temperature', value)
                print(step)
                
        # print (step, len(frame))
        # print(frame[:, 0])

    # for step, cell in enumerate(data.surf_t):
    #     # Each timestep has:
    #     #  => a time value
    #     #  => an xy grid with values
    #     time = cell.time.values
    #     for x_step, x_cell in enumerate(cell.xi_rho):
    #         print('time step', step)
    #         print('x step', x_step)
    #     # xi_rho = measurement.xi_rho[time]
        
        # print('xi_rho', eta_rho, xi_rho)

    #Creating a list of contourf plots to be converted to geojson 
    list_geo = []

    for i in np.arange(len(sst)):
        data_crs = ccrs.PlateCarree()
        figure = plt.figure()
        ax = plt.axes(projection=ccrs.epsg(3857))
        contourf = ax.contourf(lon, lat, sst[i,:,:],vmin = cmin, vmax = cmax, levels=contour_levels, cmap=colormap)
        list_geo.append(contourf)
        plt.close()

    fig = plt.figure()
    ax = plt.axes(projection=ccrs.epsg(3857))
    contourf = ax.contourf(lon, lat, sst[0,:,:],vmin = cmin, vmax = cmax, levels=contour_levels, cmap=colormap)
    
    plt.savefig('./figure.png')
