import styles from './Button.module.css'

export function Button({ variant = 'primary', size = 'md', className = '', ...props }) {
  const classes = [styles.button, styles[variant], styles[size], className].join(' ')
  return <button type="button" className={classes} {...props} />
}
