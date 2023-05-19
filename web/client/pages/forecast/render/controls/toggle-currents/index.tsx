import { useContext } from 'react'
import { context as modelContext } from '../../_context'
import IconButton from '@mui/material/IconButton'
import { TailWind } from '../../../../../components/icons'
import Tooltip from '@mui/material/Tooltip'
import Span from '../../../../../components/span'

export default () => {
  const { showCurrents, setShowCurrents } = useContext(modelContext)

  return (
    <Tooltip placement="left-start" title="Toggle currents">
      <Span>
        <IconButton disabled onClick={() => setShowCurrents(b => !b)} color="primary" size="small">
          <TailWind
            sx={{
              color: theme => (showCurrents ? theme.palette.success.dark : 'primary'),
            }}
            fontSize="small"
          />
        </IconButton>
      </Span>
    </Tooltip>
  )
}
