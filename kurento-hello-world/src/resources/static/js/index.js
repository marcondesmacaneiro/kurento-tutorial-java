/*
* (C) Copyright 2014 Kurento (http://kurento.org/)
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the GNU Lesser General Public License
* (LGPL) version 2.1 which accompanies this distribution, and is available at
* http://www.gnu.org/licenses/lgpl-2.1.html
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
* Lesser General Public License for more details.
*
*/

var webRtcPeer;
var videoInput;
var videoOutput;

window.onload = function() {
	console = new Console('console', console);
	console.log("Loading complete ...");
	videoInput = document.getElementById('videoInput');
	videoOutput = document.getElementById('videoOutput');
}

function start() {
	console.log("Starting video call ...");
	showSpinner(videoInput, videoOutput);

	webRtcPeer = kurentoUtils.WebRtcPeer.startSendRecv(videoInput, videoOutput,
			function(offerSdp, wp) {
				console.info('Invoking SDP offer callback function '
						+ location.host);
				$.ajax({
					url : location.protocol + '/helloworld',
					type : 'POST',
					dataType : 'text',
					contentType : 'application/sdp',
					data : offerSdp,
					success : function(data) {
						console.log("Received sdpAnswer from server. Processing ...");
						wp.processSdpAnswer(data);
					},
					error : function(jqXHR, textStatus, error) {
						console.error(error);
					}
				});
			});
}

function stop() {
	console.log("Stopping video call ...");
	if (webRtcPeer) {
		webRtcPeer.dispose();
	}
	videoInput.src = '';
	videoOutput.src = '';
	hideSpinner(videoInput, videoOutput);
}

function showSpinner() {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].poster = './img/transparent-1px.png';
		arguments[i].style.background = "center transparent url('./img/spinner.gif') no-repeat";
	}
}

function hideSpinner() {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].poster = './img/webrtc.png';
		arguments[i].style.background = '';
	}
}
