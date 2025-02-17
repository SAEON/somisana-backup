import { Link, useMatch } from 'react-router-dom'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

export default ({ onClick, label, to, Icon, href }) => {
  const match = useMatch(to)
  const isActive = Boolean(match)

  return (
    <MenuItem
      dense
      component={Link}
      rel={href && 'noopener noreferrer'}
      target={href && '_blank'}
      onClick={onClick}
      to={to || ''}
      href={href}
    >
      <ListItemIcon
        sx={{
          color: theme => (match ? theme.palette.primary.main : 'inherit'),
        }}
      >
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        sx={{
          color: theme => (match ? theme.palette.primary.main : 'inherit'),
        }}
        primary={label}
      />
    </MenuItem>
  )
}
