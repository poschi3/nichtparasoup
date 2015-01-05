; /* remember for development: lines that include the string "@stripOnBuild" will be stripped on build ;-) */


/* hot keys coming soon.

idea:
* right(39) := make interval slower
* left(37) := make interval faster
* space(32) := toggle play/pause
* escape(27) := toggle boss mode -> stop all loading, make all content invisible and show some productive instead ;-)


if a hot key is pressed, show a badge or something for notification ....
maybe its enough to just toggle the <header> or something?

hot keys need to be marked in the <footer> or somewhere noticeable ...

 */

(function (window)
{ "use strict";

	var addEvent = window.helperFuncs.addEvent
	  , fireEvent = window.helperFuncs.fireEvent;
	var log = window.helperFuncs.log;

	var cancelBubble = function (event)
	{
		event.cancelBubble = true;
		if ( event.stopPropagation ) { event.stopPropagation(); }
		if ( event.stopImmediatePropagation ) { event.stopImmediatePropagation(); }
		if ( event.preventDefault ) { event.preventDefault(); }
	};

	var className_forceShow = ' forceShow'
	  , className_active = ' active';


	addEvent(window, 'load', function ()
	{
		var document = this.document;

		var c_speedE = document.getElementById('c_speed')
		  , min = parseInt(c_speedE.getAttribute('min'))
		  , max = parseInt(c_speedE.getAttribute('max'));

		var c_stateE = document.getElementById('c_state');

		var hotkeysE = document.getElementById('hotkeys')
		  , controlsE = document.getElementById('controls');

		addEvent(window, 'keydown', function (event)
		{
			var np = this.nichtparasoup;
			if ( ! np ) { return; }

			if ( ! event ) { event = window.event; }

			var bubble = true;

			log('keyDown:', event.keyCode); // @stripOnBuild

			var keyCode = event.keyCode || event.which;
			switch ( keyCode )
			{
				case 39 : // right : increase speed
				case 37 : // left : decrease speed
					c_speedE.blur(); // prevent possible double trigger loops ...
					cancelBubble(event);
					var speed = parseInt(c_speedE.value) + ( keyCode == 39 ? +1 : -1 )  ;
					if ( speed < min ) { speed = min; }
					else if ( speed > max ) { speed = max; }
					c_speedE.value = speed;
					fireEvent(c_speedE, 'change');
					break;
				case 32 : // space
					c_stateE.blur(); // prevent possible double trigger loops ...
					cancelBubble(event);
					c_stateE.checked = !c_stateE.checked; // no xor in JS ? boohoo
					fireEvent(c_stateE, 'change');
					break;
				case 27 : // escape
					cancelBubble(event);
					var bossStateConst = np.constants.stateBS.boss;
					np.setState(bossStateConst, !np.getState(bossStateConst));
					break;
			}

			var hotKeyIndicator = document.getElementById('hk_'+ keyCode );
			if ( hotKeyIndicator )
			{
				hotkeysE.className += className_forceShow;
				controlsE.className += className_forceShow;
				hotKeyIndicator.className += className_active;
				window.setTimeout(function ()
					{
						hotkeysE.className = hotkeysE.className.replace(className_forceShow, '');
						controlsE.className = controlsE.className.replace(className_forceShow, '');
						hotKeyIndicator.className = hotKeyIndicator.className.replace(className_active, '')
					}, 1800);
			}

			return bubble;
		});
	});

})(window);