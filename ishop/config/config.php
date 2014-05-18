<?php return array (
  'logs' => 
  array (
    'path' => 'logs/log',
    'type' => 'file',
  ),
  'DB' => 
  array (
    'type' => 'mysql',
    'tablePre' => 'ishop_',
    'read' => 
    array (
      0 => 
      array (
        'host' => '127.0.0.1:3306',
        'user' => 'root',
        'passwd' => '',
        'name' => 'ishop',
      ),
    ),
    'write' => 
    array (
      'host' => '127.0.0.1:3306',
      'user' => 'root',
      'passwd' => '',
      'name' => 'ishop',
    ),
  ),
  'langPath' => 'language',
  'viewPath' => 'views',
  'skinPath' => 'skin',
  'classes' => 'classes.*',
  'rewriteRule' => 'url',
  'theme' => 
  array (
    'pc' => 'default',
  ),
  'skin' => 
  array (
    'pc' => 'default',
  ),
  'timezone' => 'Etc/GMT-8',
  'upload' => 'upload',
  'dbbackup' => 'backup/database',
  'safe' => 'cookie',
  'safeLevel' => 'none',
  'lang' => 'zh_sc',
  'debug' => false,
  'configExt' => 
  array (
    'site_config' => 'config/site_config.php',
  ),
  'encryptKey' => 'b497668b4a86b3827ab9fa8a79a609eb',
)?>