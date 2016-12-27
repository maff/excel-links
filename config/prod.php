<?php

// configure your app for the production environment

$app['version']      = '0.0.1';
$app['twig.path']    = array(__DIR__ . '/../templates');
$app['twig.options'] = array('cache' => __DIR__ . '/../var/cache/twig');
