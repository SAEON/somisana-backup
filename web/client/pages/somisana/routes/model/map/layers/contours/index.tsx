import { useContext, useEffect } from 'react'
import { context as mapContext } from '../../_context'
import { context as bandDataContext } from '../../../band-data/_context'
import { tricontour } from 'd3-tricontour'
import { contours } from 'd3-contour'
import { Linear as Loading } from '../../../../../../../components/loading'

export default () => {
  const { map } = useContext(mapContext)
  const gql = useContext(bandDataContext)

  if (gql.error) {
    throw gql.error
  }

  useEffect(() => {
    const { data } = gql

    if (data) {
      const { id, json } = data.data

      if (map.getLayer(id)) {
        map.setLayoutProperty(id, 'visibility', 'visible')
      } else {
        const c = tricontour()
        c.thresholds(100)
        const triContours = c(json)

        const c2 = contours()
        c2.size([152, 106])
        const v = json.map(([, , v]) => v)
        const v2 = c2(v)
        console.log(v2)

        const geojson = {
          type: 'FeatureCollection',
          features: triContours.map(({ type, coordinates, value }) => ({
            type: 'Feature',
            properties: { value },
            geometry: {
              type,
              coordinates,
            },
          })),
        }

        const min = geojson.features[0].properties.value
        const max = geojson.features[geojson.features.length - 1].properties.value
        const range = max - min

        map.addSource(id, {
          type: 'geojson',
          data: geojson,
        })

        const exp = ['*', 255, ['/', ['-', ['get', 'value'], min], range]]

        map.addLayer(
          {
            id,
            type: 'fill',
            source: id,
            layout: {},
            paint: {
              'fill-color': ['rgba', ['+', 0, exp], 0, ['-', 255, exp], 1],
            },
          },
          'coordinates'
        )
      }
    }

    return () => {
      if (data) {
        const { id } = data.data
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', 'none')
        }
      }
    }
  }, [gql])

  if (gql.loading) {
    return <Loading />
  } else {
    return null
  }
}
