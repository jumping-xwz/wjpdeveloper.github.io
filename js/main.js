

$(document).ready(function () {

  const wjpHyde = {};

  wjpHyde.backToTop = function() {
    const $backToTop = $('#back-to-top');

    $(window).scroll(function() {
      if ($(window).scrollTop() > 100) {
        $backToTop.fadeIn(1000);
      } else {
        $backToTop.fadeOut(1000);
      }
    });

    $backToTop.click(function() {
      $('body,html').animate({scrollTop: 0});
    });
  };

  wjpHyde._initToc = function() {
    const SPACING = 20;
    const $toc = $('.post-toc');
    const $footer = $('.post-footer');

    if ($toc.length) {
      const minScrollTop = $toc.offset().top - SPACING;
      const maxScrollTop = $footer.offset().top - $toc.height() - SPACING;

      const tocState = {
        start: {
          'position': 'absolute',
          'top': minScrollTop,
        },
        process: {
          'position': 'fixed',
          'top': SPACING,
        },
        end: {
          'position': 'absolute',
          'top': maxScrollTop,
        },
      };

      $(window).scroll(function() {
        const scrollTop = $(window).scrollTop();

        if (scrollTop < minScrollTop) {
          $toc.css(tocState.start);
        } else if (scrollTop > maxScrollTop) {
          $toc.css(tocState.end);
        } else {
          $toc.css(tocState.process);
        }
      });
    }

    const HEADERFIX = 30;
    const $toclink = $('.toc-link');
    const $headerlink = $('.headerlink');
    const $tocLinkLis = $('.post-toc-content li');

    const headerlinkTop = $.map($headerlink, function(link) {
      return $(link).offset().top;
    });

    const headerLinksOffsetForSearch = $.map(headerlinkTop, function(offset) {
      return offset - HEADERFIX;
    });

    const searchActiveTocIndex = function(array, target) {
      for (let i = 0; i < array.length - 1; i++) {
        if (target > array[i] && target <= array[i + 1]) return i;
      }
      if (target > array[array.length - 1]) return array.length - 1;
      return -1;
    };

    $(window).scroll(function() {
      const scrollTop = $(window).scrollTop();
      const activeTocIndex = searchActiveTocIndex(headerLinksOffsetForSearch, scrollTop);

      $($toclink).removeClass('active');
      $($tocLinkLis).removeClass('has-active');

      if (activeTocIndex !== -1) {
        $($toclink[activeTocIndex]).addClass('active');
        let ancestor = $toclink[activeTocIndex].parentNode;
        while (ancestor.tagName !== 'NAV') {
          $(ancestor).addClass('has-active');
          ancestor = ancestor.parentNode.parentNode;
        }
      }
    });
  };

  wjpHyde.fancybox = function() {
    if ($.fancybox) {
      $('.post-content').each(function() {
        $(this).find('img').each(function() {
          $(this).wrap(`<a class="fancybox" href="${this.src}" data-fancybox="gallery" data-caption="${this.title}"></a>`);
        });
      });

      $('.fancybox').fancybox({
        selector: '.fancybox',
        protect: true,
      });
    }
  };

  wjpHyde.toc = function() {
    const tocContainer = document.getElementById('post-toc');
    if (tocContainer !== null) {
      const toc = document.getElementById('TableOfContents');
      if (toc === null) {
        // toc = true, but there are no headings
        tocContainer.parentNode.removeChild(tocContainer);
      } else {
        this._refactorToc(toc);
        this._linkToc();
        this._initToc();
      }
    }
  };

  wjpHyde._refactorToc = function(toc) {
    // when headings do not start with `h1`
    const oldTocList = toc.children[0];
    let newTocList = oldTocList;
    let temp;
    while (newTocList.children.length === 1
    && (temp = newTocList.children[0].children[0]).tagName === 'UL') {
      newTocList = temp;
    }

    if (newTocList !== oldTocList) toc.replaceChild(newTocList, oldTocList);
  };

  wjpHyde._linkToc = function() {
    const links = document.querySelectorAll('#TableOfContents a:first-child');
    for (let i = 0; i < links.length; i++) links[i].className += ' toc-link';

    for (let num = 1; num <= 6; num++) {
      const headers = document.querySelectorAll('.post-content>h' + num);
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        header.innerHTML = `<a href="#${header.id}" class="headerlink anchor"></a>${header.innerHTML}`;
      }
    }
  };

  wjpHyde.responsiveTable = function() {
    const tables = document.querySelectorAll('.post-content > table');
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      table.parentElement.replaceChild(wrapper, table);
      wrapper.appendChild(table);
    }
  };

  wjpHyde.backToTop();
  wjpHyde.toc();
  wjpHyde.fancybox();
  wjpHyde.responsiveTable();
});
