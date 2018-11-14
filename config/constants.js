export default {
  'project_name': 'express-mvc-generator',
  'host': {
    'test': {
      'url': 'http://localhost:8042',
      'base': ''
    }
  },
  'database': {
    'mongo': {
      'test': {
        'url': 'mongodb://127.0.0.1/DE',
        'userDB': {
          'user': 'plachado',
          'pass': 'pacharapon'
        }
      }
    },
    'oracle': {
      'production': {
        'user': 'DE',
        'password': 'DE',
        'connectString': '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.1.10)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=HPDB)))'
      }
    }
  }
}
