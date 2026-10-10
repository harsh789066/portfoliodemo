const header = document.querySelector("#header");

if (header) {
	const progressBar = document.createElement("div");
	progressBar.className = "scroll-progress";
	progressBar.setAttribute("aria-hidden", "true");
	document.body.append(progressBar);

	const updateScrollState = () => {
		const scrollableHeight =
			document.documentElement.scrollHeight - window.innerHeight;
		const progress = scrollableHeight > 0
			? window.scrollY / scrollableHeight
			: 0;

		header.classList.toggle("scrolled", window.scrollY > 40);
		progressBar.style.transform = `scaleX(${progress})`;
	};

	window.addEventListener("scroll", updateScrollState, { passive: true });
	updateScrollState();
}

const revealItems = document.querySelectorAll(
	".about-card, .skill-item, .project-card, .timeline-item, .contact-box"
);

revealItems.forEach((item, index) => {
	item.classList.add("reveal-item");
	item.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
	const revealObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("show");
				revealObserver.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12 });

	revealElements.forEach((element) => revealObserver.observe(element));
} else {
	revealElements.forEach((element) => element.classList.add("show"));
}

const skillItems = document.querySelectorAll(".skill-item");

skillItems.forEach((item) => {
	const control = item.querySelector(".skill-header");
	if (!control) return;

	control.setAttribute("role", "button");
	control.setAttribute("tabindex", "0");
	control.setAttribute("aria-expanded", "false");

	const toggleSkill = () => {
		const willOpen = !item.classList.contains("active");

		skillItems.forEach((other) => {
			other.classList.remove("active");
			other.querySelector(".skill-header")?.setAttribute("aria-expanded", "false");
		});

		if (willOpen) {
			item.classList.add("active");
			control.setAttribute("aria-expanded", "true");
		}
	};

	control.addEventListener("click", toggleSkill);
	control.addEventListener("keydown", (event) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			toggleSkill();
		}
	});
});

const canUsePointerMotion =
	window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
	!window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canUsePointerMotion) {
	const heroCard = document.querySelector(".hero-card");

	if (heroCard) {
		const profile = heroCard.querySelector(".profile-circle");

		heroCard.addEventListener("pointermove", (event) => {
			const bounds = heroCard.getBoundingClientRect();
			const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
			const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

			heroCard.style.setProperty("--pointer-x", `${offsetX * 14}px`);
			heroCard.style.setProperty("--pointer-y", `${offsetY * 14}px`);
			profile.style.transform = `translate(${-offsetX * 8}px, ${-offsetY * 8}px)`;
		});

		heroCard.addEventListener("pointerleave", () => {
			heroCard.style.setProperty("--pointer-x", "0px");
			heroCard.style.setProperty("--pointer-y", "0px");
			profile.style.transform = "";
		});
	}

	document.querySelectorAll(".project-card").forEach((card) => {
		card.addEventListener("pointermove", (event) => {
			const bounds = card.getBoundingClientRect();
			const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
			const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

			card.style.transform =
				`perspective(900px) rotateX(${-pointerY * 4}deg) ` +
				`rotateY(${pointerX * 4}deg) translateY(-4px)`;
		});

		card.addEventListener("pointerleave", () => {
			card.style.transform = "";
		});
	});
}
