$(function () {
    const carrinho = {};

    function atualizarCarrinho() {
        const itens = Object.values(carrinho);
        const quantidade = itens.reduce((total, item) => total + item.quantidade, 0);
        const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
        const $itens = $('#itens-carrinho');

        $('#contador-carrinho').text(quantidade);
        $('#total-carrinho').text(total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }));
        $('#finalizar-compra').prop('disabled', itens.length === 0);

        if (!itens.length) {
            $itens.html('<p class="text-muted text-center">Seu carrinho está vazio.</p>');
            return;
        }

        $itens.empty();
        itens.forEach(function (item) {
            $('<div class="item-carrinho border-bottom pb-3 mb-3">')
                .append($('<div class="fw-bold">').text(item.nome))
                .append($('<div class="d-flex justify-content-between align-items-center mt-2">')
                    .append($('<span>').text((item.preco * item.quantidade).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })))
                    .append($('<div class="btn-group btn-group-sm">')
                        .append($('<button type="button" class="btn btn-outline-secondary diminuir-item">-</button>').attr('data-produto', item.nome))
                        .append($('<span class="btn btn-outline-secondary disabled">').text(item.quantidade))
                        .append($('<button type="button" class="btn btn-outline-secondary aumentar-item">+</button>').attr('data-produto', item.nome))
                        .append($('<button type="button" class="btn btn-outline-danger remover-item">x</button>').attr('data-produto', item.nome))))
                .appendTo($itens);
        });
    }

    $('.card').on('mouseenter', function () {
        $(this).stop(true).animate({ marginTop: '-8px' }, 200);
    }).on('mouseleave', function () {
        $(this).stop(true).animate({ marginTop: '0' }, 200);
    });

    $('#alternar-detalhes').on('click', function () {
        const $detalhes = $('#detalhes-interacao');
        const estaVisivel = !$detalhes.prop('hidden');

        if (estaVisivel) {
            $detalhes.stop(true, true).slideUp(250, function () {
                $detalhes.prop('hidden', true);
            });
        } else {
            $detalhes.prop('hidden', false).hide().slideDown(250);
        }
        $(this).attr('aria-expanded', String(!estaVisivel)).text(estaVisivel ? 'Mostrar detalhes' : 'Ocultar detalhes');
    });

    $('#animar-forma').on('click', function () {
        $('#forma-interativa').stop(true, true).animate({
            width: '170px',
            height: '170px',
            borderRadius: '50%'
        }, 500).animate({
            width: '130px',
            height: '130px',
            borderRadius: '32% 68% 55% 45% / 45% 40% 60% 55%'
        }, 500);
    });

    $('#resetar-forma').on('click', function () {
        $('#forma-interativa').stop(true, true).removeClass('alternate').css({
            width: '',
            height: '',
            borderRadius: ''
        });
        $('#nome-visitante').val('');
        $('#saudacao').text('');
    });

    $('#forma-interativa').on('dblclick', function () {
        $(this).toggleClass('alternate');
    });

    $('#nome-visitante').on('keyup', function () {
        const nome = $(this).val().trim();
        $('#saudacao').text(nome ? 'Olá, ' + nome + '! Aproveite a visita.' : '');
    });

    $('.btn-comprar').on('click', function () {
        const produto = $(this).data('produto');
        const preco = Number($(this).data('preco'));
        const $mensagem = $('#mensagem-compra');

        if (carrinho[produto]) {
            carrinho[produto].quantidade += 1;
        } else {
            carrinho[produto] = { nome: produto, preco: preco, quantidade: 1 };
        }
        atualizarCarrinho();

        $mensagem
            .text('"' + produto + '" foi adicionado ao carrinho!')
            .stop(true, true)
            .fadeIn(300)
            .delay(2500)
            .fadeOut(500);
    });

    $('#itens-carrinho').on('click', '.aumentar-item, .diminuir-item, .remover-item', function () {
        const produto = $(this).data('produto');
        const item = carrinho[produto];

        if ($(this).hasClass('aumentar-item')) {
            item.quantidade += 1;
        } else if ($(this).hasClass('diminuir-item')) {
            item.quantidade -= 1;
        } else {
            item.quantidade = 0;
        }

        if (item.quantidade <= 0) {
            delete carrinho[produto];
        }
        atualizarCarrinho();
    });

    $('a[href^="#"]').on('click', function (event) {
        const destino = $(this).attr('href');

        if (destino !== '#' && $(destino).length) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: $(destino).offset().top - 70
            }, 500);
        }
    });
});