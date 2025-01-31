<?php
/**
 * Ajax action with SHORTINIT.
 *
 * @package kagg/generator
 */

/**
 * Set short WordPress init.
 */
const SHORTINIT = true;

// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
$root = isset( $_SERVER['SCRIPT_FILENAME'] ) ? filter_var( $_SERVER['SCRIPT_FILENAME'], FILTER_SANITIZE_STRING ) : '';
$root = dirname( dirname( dirname( dirname( dirname( dirname( $root ) ) ) ) ) );

require $root . '/wp-load.php';

// Components needed for i18n to work properly.
require $root . '/wp-includes/l10n.php';
require $root . '/wp-includes/class-wp-locale.php';

// Components needed for check_ajax_referer() to work.
require $root . '/wp-includes/capabilities.php';
require $root . '/wp-includes/class-wp-roles.php';
require $root . '/wp-includes/class-wp-role.php';
require $root . '/wp-includes/class-wp-user.php';
require $root . '/wp-includes/user.php';
require $root . '/wp-includes/class-wp-session-tokens.php';
require $root . '/wp-includes/class-wp-user-meta-session-tokens.php';
require $root . '/wp-includes/kses.php';
require $root . '/wp-includes/rest-api.php';

wp_plugin_directory_constants();
wp_cookie_constants();

require $root . '/wp-includes/pluggable.php';

// Load generator class.
require '../../vendor/autoload.php';

( new KAGG\Generator\Generator() )->run();
