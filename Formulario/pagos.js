/*document.getElementById("pagado"). addEventListener("keyup", (event) => {
    let pago= $(event.target). val ();
    let interse= $("#interes").val();
    let deuda= $("#prestamo").val();
    let numCuota= (pago/(deuda/parseFloat(interes)));
$("#cuota").val (Number(numerocuota.tofixed (1)));
});*/
    //$('#modalpago').on("show.bs.modal",(e) => {
         /* const  form =  $(".formulario");[0] 
          $('#BotonModal').click (e) => {
        $('#modalPagos')modal("show") ; */
       /* $('#modalpago').on("show.bs.modal",(e) => {
            const  form =  $(".formulario");
            console.log (form)*/
            $(document).ready(function () {
                let fecha;
                let totalCuotas = 0; // Variable para acumular las cuotas           
                // Función para calcular la fecha del préstamo
                function calcularFechaPrestamo(fecha) {
                    return new Promise((resolve, reject) => {
                        let fechaPrestamo = new Date(fecha);
                        let fechaActual = new Date();
                        let diferenciaAnios = fechaActual.getFullYear() - fechaPrestamo.getFullYear();
                        let diferenciaMeses = fechaActual.getMonth() - fechaPrestamo.getMonth();
                        let diferenciaDias = fechaActual.getDate() - fechaPrestamo.getDate();
                        if (diferenciaDias <= 0) {
                            diferenciaMeses -= 1;
                        }
                        let cuotasPendientes = (diferenciaAnios * 12) + diferenciaMeses;
                        if (cuotasPendientes === 0) {
                            cuotasPendientes = 1;
                        }
                        resolve({
                            Cuotapendiente: cuotasPendientes
                        });
                        reject('El cálculo de la cuota pendiente es inválido.');
                    });
                }          
                // Función para calcular el pago
                function calcularPago(pago, deuda, interes, pendiente) {
                    return new Promise((resolve, reject) => {
                        let interesDecimal = interes / 100;
                        let valorInteres = deuda * interesDecimal;
                        let cuota = (pago / (deuda + valorInteres)).toFixed(1);           
                        let pagoInteres = valorInteres;
                        let valorActual = deuda - pago;
                        if (pendiente !== 0 && cuota <= pendiente) {
                            pagoInteres = parseFloat(cuota) * valorInteres;
                            valorActual = deuda - pagoInteres;
                        } else {
                            pagoInteres = parseFloat(pendiente) * valorInteres;
                            valorActual = deuda - pago;
                        }
                        let pagoCapital = pago - pagoInteres;
                        if (cuota >= 0) {
                            resolve({
                                numCuota: Number(cuota),
                                pagoCapital: pagoCapital,
                                pagoInteres: pagoInteres,
                                valorActual: valorActual
                            });
                        } else {
                            reject('El cálculo de la cuota es inválido');
                        }
                    });
                }          
                // Evento de cambio para la fecha del préstamo
                $('#fechaPrestamo').change((e) => {
                    fecha = $(e.target).val();
                    calcularFechaPrestamo(fecha)
                        .then(result => {
                            $("#cuotasPendientes").val(result.Cuotapendiente);
                        }).catch(err => {
                            console.error("Error al calcular", err);
                        });
                });           
                // Evento de cambio para el valor prestado y el interés
                $("#valorPrestado, #interes").on("input", function () {
                    let valorPrestado = parseFloat($("#valorPrestado").val());
                    let interes = parseFloat($("#interes").val());
                    if (!isNaN(valorPrestado) && !isNaN(interes)) {
                        let totalPagar = valorPrestado + (valorPrestado * (interes / 100));
                        $("#totalPagar").val(totalPagar.toFixed());
                    }
                });         
                // Evento de clic para el botón "Modal"
                $('#botonModal').click(function () {
                    const valpres = $('#valorPrestado').val();
                    const interes = $('#interes').val();
                    const totalPagar = $('#totalPagar').val();          
                    if (valpres && interes && totalPagar) {
                        Swal.fire({
                            icon: "success",
                            title: "Continuemos",
                            timer: 1500
                        }).then(() => {
                            $('#prestamo').val(totalPagar);                      
                            $('#intereses').val(interes + ' %');
                            $('#pagos').modal('show');
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Debe llenar todos los campos!",
                        });
                    }
                });         
                // Evento para la vista del modal de pagos
                $('#pagos').on('show.bs.modal', (e) => {
                    const form = $('.formulario')[0];            
                    let interes = parseFloat($("#interes").val());
                    let pendiente = parseFloat($("#cuotasPendientes").val());
                    let valpres = parseFloat($('#valorPrestado').val());
                    const tot = $('#totalPagar').val();         
                    if (isNaN(interes) || isNaN(valpres)) {
                        form.classList.remove('was-validated');
                        e.preventDefault();
                        e.stopPropagation();
                        isNaN(interes) ? $("#interes").addClass('is-invalid') : $('#valorPrestado').addClass('is-invalid');
                        form.classList.remove('is-invalid');
                        return;
                    } else {
                        $('.invalid-feedback').css('display', 'none');
                        const formulario = $('.formulario');
                        const formu = formulario.find('input');
                        formu.each(function () {
                            $(this).removeClass('is-invalid');
                        });
                    }          
                    if (!form.checkValidity()) {
                        e.preventDefault();
                        e.stopPropagation();
                        form.classList.add('was-validated');
            
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Debe llenar todos los campos!",
                        });           
                        return;
                    } else {
                        let deuda = $('#totalPagar').val() !== '' ? $("#totalPagar").val() : $('#valorPrestado').val();
                        $('#prestamo').val(deuda);
                        let interes = $("#interes").val();
                        $('#interes').val(interes + ' %');
                        let pendiente = $("#cuotasPendientes").val();
                        // Evento de tecla para el input de pago
                        $('#pago').keyup((e) => {
                            let pago = parseFloat($(e.target).val());
                            if (!isNaN(pago) && pago > 0) {
                                calcularPago(pago, deuda, interes, pendiente)
                                    .then(resultado => {
                                        totalCuotas += parseFloat(resultado.numCuota); // Incrementa el total de cuotas pagadas
                                        $('#cuota').val(totalCuotas.toFixed(1));
                                        $("#pagoInteres").val(resultado.pagoInteres.toFixed(1));
                                        $("#pagoCapital").val(resultado.pagoCapital.toFixed(1));
                                        $("#valorActualCredito").val(resultado.valorActual.toFixed(1));
                                        $("#valorIntereses").val(resultado.pagoInteres.toFixed(1));          
                                        // Actualiza los valores para el próximo cálculo
                                        deuda = resultado.valorActual;
                                        pendiente -= totalCuotas;
            
                                    }).catch(error => {
                                        console.error("Error al calcular", error);
                                    });                           
                
                }
            });
        }       
                    // Evento de clic para el botón "Guardar Pago"
                    $("#guardarPago").click(function () {
                        let cuota = parseFloat($('#cuota').val());
                        let cuota_pend = parseFloat($('#cuotasPendientes').val());
                        let deuda_actual = parseFloat($('#valorActualCredito').val());
            
                        Swal.fire({
                            icon: "success",
                            title: deuda_actual <= 0 ? "¡Felicitaciones! Has pagado tu crédito." : "!Información almacenada!",
                            timer: 1500
                        }).then(() => {
                            if (cuota > cuota_pend) {
                                cuota_pend = 0;
                                $('#cuotasPendientes').val(cuota_pend);
                            } else {
                                cuota_pend = cuota_pend - cuota;
                                $('#cuotasPendientes').val(cuota_pend);
                            }
                            $('#totalPagar').val(deuda_actual.toFixed(1));
                            $('#pagos').modal("hide");
                            let modal = $('#pagos').find('input');
                            modal.each(function () {
                                $(this).val('');
                            });
                        });
                    });
                });      
             // Funcionalidad para el botón "Limpiar"
          $('#limpiar').click(function () {
           let formu = $('.formulario').find('input');
            formu.each(function () {
               $(this).val('');
            });
            $('#cuota').val('');
            $('#pagoInteres').val('');
            $('#pagoCapital').val('');
            $('#valorActualCredito').val('');
            $('#valorIntereses').val('');
            $('#totalPagar').val('');
            $('#pago').removeClass('is-invalid');
    });

    // Funcionalidad para el botón "Cerrar"
    $('#cerrar').click(function () {
        $('#pagos').modal('hide');
    });
    });
   