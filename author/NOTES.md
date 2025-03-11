
<!----------------------------------------------------------------------------->
## Literals
<!----------------------------------------------------------------------------->

### Numeric

```
1
-1
100
10_000
```

### Strings
```
"Hello World"
```

### Symbols
```
`foo     
```

### Booleans
```
#t
#f
```

### Blocks
```
[ 1 + ]
```
NOTE: (see more below)

<!----------------------------------------------------------------------------->
## Word Definition
<!----------------------------------------------------------------------------->

```
: <name> <words> ;
```

<!----------------------------------------------------------------------------->
## Module Definition
<!----------------------------------------------------------------------------->
```
:: <name> 
    ...
;;
```

<!----------------------------------------------------------------------------->
## Conventions
<!----------------------------------------------------------------------------->

We use the following convention when defining built in words, with the 
exception of standard operators (+, -, ==, etc.) and standard stack operations
(`DUP`, `SWAP`, etc.). 

Words should be in ALL CAPS and use one of the characters below:
```
>     pop from the stack, push into something
<     pop from something push onto the stack
.     peek from something and push onto the stack
^     drop from something (does not affect the stack)
```
Normally the character is a prefix, but can be used differnetly if needed. 

> NOTE: Many of the words defined in this way are meant used as very low level 
> words, to compose other more user friendly words. For instance, most of the 
> control structures are actually implemented using these kinds of low level 
> words. 

In addition to this prefix convention, we also also use an optional post-fix 
convention to indicate a word's behavior.
```
?     indicates that the operation is conditional
!     indicates that the operation is side effectual (I/O, etc.)
```

> A good example of this is the I/O operation `>PUT!` is a request 
> to send data to the outside world, so marked with `!`. Or the 
> conditional block constructor `]?` which will execute the block based 
> the boolean on the TOS. 

<!----------------------------------------------------------------------------->
## Platform Builtins
<!----------------------------------------------------------------------------->

### Stack
```
    DUP        ( a     -- a a   )      duplicate the top of the stack
    DROP       ( a     --       )      drop the item at the top of the stack    
    
    OVER       ( b a   -- b a b )      like DUP, but for the second item on the stack    
    SWAP       ( b a   -- a b   )      swap the top two items on the stack

    RDUP       ( c b a -- c b a c )    duplicate the 3rd item to the top of the stack
    ROT        ( c b a -- b a c )      rotate the 3rd item to the top of the stack    
    -ROT       ( c b a -- a c b )      rotate the TOS the 3rd item of the stack
```
### Math
```
    +          ( n n -- n )            addition
    -          ( n n -- n )            subtraction
    *          ( n n -- n )            multiplication
    /          ( n n -- n )            division
    %          ( n n -- n )            modulo
```
### Boolean 
```
    !          ( #t -- #f )            boolean invert 
    !!         (  l -- b  )            conver to boolean
```
### Equality
```
    ==         ( l l -- b )            equal
    !=         ( l l -- b )            not equal
```
### Conditions
```
    <          ( l l -- b )            less than
    <=         ( l l -- b )            less than or equal
    >          ( l l -- b )            greater than
    >=         ( l l -- b )            greater than or equal
```
### Stings
```
    ~          ( l l -- s )            string concat
```
<!----------------------------------------------------------------------------->
## Low-level Builtins
<!----------------------------------------------------------------------------->

### Control
```
    >R         ( a --   ) ( a --   )   take from stack and push onto control stack
    <R         (   -- a ) (   -- a )   take from control stack and push onto stack
    .R         (   -- a ) ( a -- a )   push top of control stack onto stack
    ^R         (   --   ) (   --   )   drop the top of the control stack
```

### I/O
```
    >PUT!      ( l --   )              print string to output
```

<!----------------------------------------------------------------------------->
## Word Builtins
<!----------------------------------------------------------------------------->

### Word Binding/Unbinding
```
    [ "FOO" ] `foo :=     // bind the `foo symbol to this block
              `foo :^     // unbind the `foo symbol
```

<!----------------------------------------------------------------------------->
## Module Builtins
<!----------------------------------------------------------------------------->

### Importing
```
    `MyModuleName >IMPORT   // given a symbol, import it as a module
```

<!----------------------------------------------------------------------------->
## Block Creation/Iteration Builtins
<!----------------------------------------------------------------------------->

### Block Creation
```
[          // start block and collect up until end token
  <block>
]          // put this block on the TOS, does not run it
]+         // run block once, iteration can be controlled with NEXT and LAST operations
]?         // pop TOS, if true, run this block, put old TOS back on TOS
]@?        // always run once, then if TOS if true, re-run/loop this block
```

> NOTE: the sigils are post-fixed to the closing block constructors, this is 
> on purpose to indicate what will happen with the block.

### Block Iteration 

These always operate within a block, and affect that enclosing block. 

```
[+]?       // NEXT - will reset the instr-counter to 0 in the enclosing block
[^]?       // LAST - set the instr-counter to the end in the enclosing block
```

Some things to keep in mind about block iteration.

- These are conditional, so will only be called if the TOS is true. 
    - for unconditional operations, simply prefix with a boolean literal
        - ex: `#t [+]?` would an unconditional "next"
- They work the same inside looping and non-looping blocks.
    - using these you can turn a non-looping block into a loop 
        - `]+` will always run once so are best for this
        - `]?` can also be used, but probably not a good idea
        - `]` can be used, but must be explicity run
        - `]@?` already loop, so not relevant here 

### Block Control

These only operate on blocks on the TOS, so only `]` is supportted as all the 
other block creators will immediately run the block. 

```
>[+]      // run the block at TOS once (dead-duck operator)
```

<!----------------------------------------------------------------------------->
## Control Structures
<!----------------------------------------------------------------------------->

### Conditionals
```
    <bool> IF <body*> THEN                 if statement
    <bool> IF <body*> ELSE <body*> THEN    if else statement
```

```
    BEGIN                                  This is a switch/case style statement
        <bool> IF <body*> THEN/BREAK       THEN/BREAK will leave the loop iff 
        <bool> IF <body*> THEN/BREAK       the IF condition is successful, 
        <bool> IF <body*> THEN/BREAK       otherwise it will continue to the 
        <bool> IF <body*> THEN/BREAK       next condition until it they are 
        <bool> IF <body*> THEN/BREAK       exhausted, at which point the 
                  <default>                "default" code is executed if none of
    END                                    the conditions succeeded.
```
> NOTE: the switch/case can be improved, it's kinda fugly now, but I didn't 
> want to add too many more keywords. 

## Conditional Loops
```
    BEGIN <body*> <bool> UNTIL             executes <body*> until the <bool> condition is false
    BEGIN <bool> WHILE <body*> REPEAT      executes <body*> until the <bool> condition is true
```

## Counted Loops
```
    <end> <start> DO <body*> LOOP          loops from <start> to <end> and executes the <body*>
```

