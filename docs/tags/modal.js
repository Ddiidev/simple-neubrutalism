var spans = document.getElementsByClassName("close-modal");

document.querySelectorAll('[class^="openModal-"]').forEach(function (button) {
	button.onclick = function () {
		var targetModalId = this.getAttribute('target-modal');
		var targetModal = document.getElementById(targetModalId);
		if (targetModal) {
			targetModal.style.display = "block";
			actionCallbackHandler(targetModal, true); // Executa a função de callback se houver
		}
	}
});

function addModalEventListeners() {
	const spans = document.getElementsByClassName("close-modal");

	Array.from(spans).forEach(function (span) {
		span.onclick = function () {
			const modal = this.closest('.modal');
			if (modal) {
				modal.setAttribute('open', 'false');
				modal.style.display = "none";
				actionCallbackHandler(span, false); // Executa a função de callback se houver
			}
		};
	});

	// Adicionar métodos close e open aos modais
	document.querySelectorAll('.modal').forEach(function (modal) {
		modal.close = function () {
			this.setAttribute('open', 'false');
			this.style.display = "none";
			actionCallbackHandler(this, false);
		};

		modal.open = function () {
			this.setAttribute('open', 'true');
			this.style.display = "block";
			actionCallbackHandler(this, true); // Executa a função de callback se houver
		};
	});
}

function actionCallbackHandler(element, isOpen) {
	const callbacks = element.getAttribute(isOpen ? 'action-open-callback' : 'action-close-callback');

	if (callbacks && typeof callbacks === 'string') {
		try {
			window[callbacks](element, isOpen);
		} catch (error) {
			console.error('Erro ao executar actionCallback:', error);
		}
	}
}

window.onclick = function (event) {
	if (event.target.classList.contains('modal') || event.target.classList.contains('close-modal')) {
		var modal = event.target.classList.contains('modal') ? event.target : event.target.closest('.modal');
		if (modal) {
			modal.setAttribute('open', 'false');
			modal.style.display = "none";
			actionCallbackHandler(modal, false); // Executa a função de callback se houver
		}
	}
}

addModalEventListeners();