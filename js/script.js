let isNavWithBg = false, isProjectilesPositioned = false, isSkillsShown = false;
const allProjectTiles = document.querySelectorAll('.project-tile'),
    portfolioBtns = document.querySelectorAll('.project-tiles__button'),
    projectTileContainer = document.querySelector('.project-tiles'),
    skillProgressContainer = document.querySelector('.skills-list'),
    navLinks = document.querySelectorAll('.main-navigation__link'),
    changePosition = document.querySelector('#welcome-section').clientHeight / 2,
    navToggler = document.querySelector('.navbar__nav-toggler__link'),
    navContainer = document.querySelector('.navbar__navigation');

navToggler.addEventListener('click', function(event) {
    event.preventDefault();
    navContainer.classList.toggle('active');
    this.classList.toggle('active');
});

portfolioBtns.forEach(function(button) {
    button.addEventListener('click', function() {
        const clickedButton = this;
        let toBeLRFirst, lRProjectTile, currentToBe;
        let isNextButtonClicked = (this.classList.contains('project-tiles__button--next') ? true : false);
        const current = document.querySelector('.project-tile.current');

        if (isNextButtonClicked) {
            const prevButton = document.querySelector('.project-tiles__button--prev');
            if (prevButton.disabled)
                prevButton.disabled = false;

            lRProjectTile = document.querySelector('.project-tile.left.first');
            currentToBe = document.querySelector('.project-tile.right.first');
            toBeLRFirst = currentToBe.nextElementSibling;
        } else {
            const nextButton = document.querySelector('.project-tiles__button--next');
            if (nextButton.disabled)
                nextButton.disabled = false;

            lRProjectTile = document.querySelector('.project-tile.right.first');
            currentToBe = document.querySelector('.project-tile.left.first');
            toBeLRFirst = currentToBe.previousElementSibling;
        }

        if (toBeLRFirst == null || !toBeLRFirst.classList.contains('project-tile'))
            clickedButton.disabled = true;

        if (lRProjectTile != null) {
            lRProjectTile.classList.remove('first');
            lRProjectTile.classList.add('second');
            zFixer();
            doEverything(current, currentToBe, toBeLRFirst, isNextButtonClicked);
        } else {
            current.classList.remove('current');
            current.classList.add((isNextButtonClicked ? 'left' : 'right'), 'first');
            zFixer();
            doCurrentFirstToBe(currentToBe, toBeLRFirst, isNextButtonClicked);
        }
    });
});

function doEverything(current, currentToBe, toBeLRFirst, isNext) {
    setTimeout(function () {
        current.classList.remove('current');
        current.classList.add((isNext ? 'left' : 'right'), 'first');
        zFixer();

        doCurrentFirstToBe(currentToBe, toBeLRFirst, isNext);
    }, 500);
}

function doCurrentFirstToBe(currentToBe, toBeLRFirst, isNext) {
    setTimeout(function () {
        currentToBe.classList.add('current');
        currentToBe.classList.remove((isNext ? 'right' : 'left'), 'first');
        zFixer();

        if (toBeLRFirst != null) {
            setTimeout(function () {
                toBeLRFirst.classList.add('first');
                toBeLRFirst.classList.remove('second');
                toBeLRFirst.style.zIndex = 99;
                zFixer();
            }, 500);
        }
    }, 500);
}

window.addEventListener('scroll', scrollEvents);

function scrollEvents() {
    if (window.innerWidth > 768) {
        if (!isNavWithBg && window.scrollY >= changePosition) {
            isNavWithBg = true;
            addRemoveClassToNavbar();
        } else if (isNavWithBg && window.scrollY <= changePosition) {
            isNavWithBg = false;
            addRemoveClassToNavbar();
        }

        const addClassAt = (window.scrollY + window.innerHeight) - projectTileContainer.clientHeight / 3;
        if ((addClassAt > projectTileContainer.offsetTop) && !isProjectilesPositioned) {
            positionProjectTiles();
            isProjectilesPositioned = true;
        } else if (!(addClassAt > projectTileContainer.offsetTop) && isProjectilesPositioned) {
            positionProjectTiles(false);
            isProjectilesPositioned = false;
        }
    }

    const animateAt = (window.scrollY + window.innerHeight) - skillProgressContainer.clientHeight / 3;
    if ((animateAt > skillProgressContainer.offsetTop) && !isSkillsShown) {
        isSkillsShown = true;
        showSkillsProgress();
    } else if (!(animateAt > skillProgressContainer.offsetTop) && isSkillsShown) {
        isSkillsShown = false;
        showSkillsProgress(false);
    }
}

function showSkillsProgress(isShowing = true) {
    const skillProgresses = document.querySelectorAll('.skills-list__progress');

    skillProgresses.forEach(function(skillProgress, index) {
        const opacity = (isShowing) ? 1 : 0;
        const width = (isShowing) ? skillProgress.getAttribute('data-progress') : 10;
        
        setTimeout(function() {
            skillProgress.style.opacity = opacity;
            skillProgress.style.width = width + '%';
        }, 200 * (index + 1));
    });
}

function positionProjectTiles(isAdding = true) {
    const middle = Math.ceil((allProjectTiles.length / 2) - 1);

    allProjectTiles.forEach(function(projectTile, index) {
        if (isAdding) {
            if (index < middle)
                projectTile.classList.add('left', (index + 1 == middle) ? 'first' : 'second');
            else if (index == middle)
                projectTile.classList.add('current');
            else
                projectTile.classList.add('right', (index == middle + 1) ? 'first' : 'second');

            zFixer();
        } else
            projectTile.classList.remove('left', 'first', 'second', 'right', 'current');
    });
}

function addRemoveClassToNavbar() {
    const navbar = document.querySelector('#navbar');
    navbar.classList.add('animateOut');

    setTimeout(function() {
        navbar.classList.remove('animateOut');
        navbar.classList.add('animateIn');
        navbar.classList.toggle('with-bg');
    }, 400);

    setTimeout(function() {
        navbar.classList.remove('animateIn');
    }, 800);
}

function zFixer() {
    const highestZValue = 1000 - (allProjectTiles.length + 1);
    let counter = 0;

    for (let itr = 0; itr < allProjectTiles.length; itr++) {
        if (allProjectTiles[itr].classList.contains('left'))
            allProjectTiles[itr].style.zIndex = highestZValue + counter++;
        else if (allProjectTiles[itr].classList.contains('current'))
            allProjectTiles[itr].style.zIndex = 1000;
        else
            allProjectTiles[itr].style.zIndex = highestZValue + --counter;
    }
}

navLinks.forEach(function (navLink) {
    navLink.addEventListener('click', eventHandler);
});

function eventHandler(event) {
    event.preventDefault();
    const targetSection = document.querySelector(this.getAttribute('href')),
        targetSectionYoffset = targetSection.offsetTop,
        startPosition = window.pageYOffset,
        distance = targetSectionYoffset - startPosition,
        duration = 1000;
    let start = null;

    if (navToggler.classList.contains('active')) {
        navToggler.classList.remove('active');
        navContainer.classList.remove('active');
    }

    window.requestAnimationFrame(step);

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;

        window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
        if (progress < duration) window.requestAnimationFrame(step);
    }

    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }
}