'use client'

import React, { useEffect } from 'react'

const BootstrapClient: React.FC = () => {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js')
    require('../assets/js/adminlte.min.js')
    require('../assets/js/jquery.min.js')
  }, [])
  return null
}

export default BootstrapClient
