export function calculateGST(basicAmount, gstPercent, taxType) {

    const gstAmount = basicAmount * gstPercent / 100;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (taxType === 'Inter') {
        igst = gstAmount;
    } else {
        cgst = gstAmount / 2;
        sgst = gstAmount / 2;
    }

    return {
        gstAmount,
        cgst,
        sgst,
        igst,
        totalAmount: basicAmount + gstAmount
    };
}