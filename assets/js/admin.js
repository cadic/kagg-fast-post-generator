/* global GeneratorObject */

/**
 * @param GeneratorObject.generateAjaxUrl
 * @param GeneratorObject.generateAjaxUrl
 * @param GeneratorObject.generateAction
 * @param GeneratorObject.generateNonce
 * @param GeneratorObject.adminAjaxUrl
 * @param GeneratorObject.cacheFlushAction
 * @param GeneratorObject.cacheFlushNonce
 * @param GeneratorObject.deleteAction
 * @param GeneratorObject.deleteNonce
 * @param GeneratorObject.nothingToDo
 * @param GeneratorObject.deleteConfirmation
 * @param GeneratorObject.generating
 * @param GeneratorObject.deleting
 * @param GeneratorObject.totalTimeUsed
 */
jQuery( document ).ready( function( $ ) {
	const logSelector = '#kagg-generator-log';
	let index, chunkSize, number, data, startTime;

	function clearMessages() {
		$( logSelector ).html( '' );
	}

	function showMessage( message ) {
		$( logSelector ).append( `<div>${message}</div>` );
	}

	function showSuccessMessage( response ) {
		showMessage( typeof response.data !== 'undefined' ? response.data: response );
	}

	function showErrorMessage( response ) {
		showMessage( response.responseText.replace( /^(.+?)<!DOCTYPE.+$/gs, '$1' ).replace( /\n/gs, '<br />' ) );
	}

	function cacheFlush() {
		data = {
			action: GeneratorObject.cacheFlushAction,
			nonce: GeneratorObject.cacheFlushNonce
		};

		$.post( {
			url: GeneratorObject.adminAjaxUrl,
			data: data,
		} )
			.done( function( response ) {
				showSuccessMessage( response );
			} )
			.fail( function( response ) {
				showErrorMessage( response );
			} )
			.always( function() {
				const endTime = performance.now();
				showMessage( GeneratorObject.totalTimeUsed.replace( /%s/, ( ( endTime - startTime ) / 1000 ).toFixed( 3 ) ) );
			} )
		;
	}

	function generateAjax( data ) {
		$.post( {
			url: GeneratorObject.generateAjaxUrl,
			data: data,
		} )
			.done( function( response ) {
				showSuccessMessage( response );

				data.index += data.chunkSize;

				if ( ! response.success || data.index >= data.number ) {
					cacheFlush();

					return;
				}

				generateAjax( data );
			} )
			.fail( function( response ) {
				showErrorMessage( response );
			} );
	}

	$( '#kagg-generate-button' ).on( 'click', function( event ) {
		event.preventDefault();

		clearMessages();

		startTime = performance.now();
		index = 0;
		chunkSize = parseInt( $( '#chunk_size' ).val() );
		number = parseInt( $( '#number' ).val() );

		if ( number <= 0 ) {
			showMessage( GeneratorObject.nothingToDo );

			return;
		}

		showMessage( GeneratorObject.generating );

		data = {
			action: GeneratorObject.generateAction,
			data: JSON.stringify( $( 'form#kagg-generator-settings' ).serializeArray() ),
			index: index,
			chunkSize: chunkSize,
			number: number,
			nonce: GeneratorObject.generateNonce
		};

		generateAjax( data, index, chunkSize, number );
	} );

	$( '#kagg-delete-button' ).on( 'click', function( event ) {
		event.preventDefault();

		clearMessages();

		if ( ! confirm( GeneratorObject.deleteConfirmation ) ) {
			return;
		}

		showMessage( GeneratorObject.deleting );

		startTime = performance.now();

		data = {
			action: GeneratorObject.deleteAction,
			nonce: GeneratorObject.deleteNonce
		};

		$.post( {
			url: GeneratorObject.adminAjaxUrl,
			data: data,
		} )
			.done( function( response ) {
				showSuccessMessage( response );
			} )
			.fail( function( response ) {
				showErrorMessage( response );
			} )
			.always( function() {
				cacheFlush();
			} );
	} );
} );
