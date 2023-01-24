# token-fun

This is a simple example of how a smart contract that purports to be an
ERC20 token might not act how you'd expect. Imagine a scenario where someone transfers 
an ERC20 balance to the wrong address, asks that it be transferred back, with the transfer to
the 'refund' address crediting it to a santioned address, or maybe adds it to a liquidity pool to swap out tokens to a baddie, or whatever... anyway no good deed goes unpunished.