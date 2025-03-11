import styles from './Loader.module.css'

const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <div className='spinner-border text-primary' role='status'>
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  )
}

export default Loader
