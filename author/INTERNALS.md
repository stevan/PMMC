<!----------------------------------------------------------------------------->
# INTERNALS
<!----------------------------------------------------------------------------->

<!----------------------------------------------------------------------------->
## Namespaces
<!----------------------------------------------------------------------------->

The system creates some basic namespaces.

- `CORE`  
    - Defined in the system 
    - holds all builtin words
    - cannot be altered at runtime
    - always `Native` words
- `_`     
    - Created at the start of compile-time
    - holds all words defined with `:` 
    - cannot be altered at runtime
    - always `User` words
- `__`    
    - Created at the start of runtime
    - holds all words created at runtime with `:=`
    - can be freely altered at runtime
    - always `User` words

<!----------------------------------------------------------------------------->
## Decompiled Control Structures
<!----------------------------------------------------------------------------->

### Conditionals
```
0 > IF "Hi" say THEN

// decompiled
0 >            (     n 0 -- #t      )
[ "Hi" say     (      #t -- #t [..] )
]?             ( #t [..] -- #t      ) INVOKE!
DROP           (      #t --         )

0 > IF "Hi" say ELSE "Goodbye" say THEN

// decompiled
0 >              (     n 0 -- #t      )
[ "Hi" say       (      #t -- #t [..] )
]?               ( #t [..] -- #t      ) INVOKE!
!                (      #t -- #f      ) << invert the condition
[ "Goodbye" say  (      #t -- #t [..] )
]?               ( #t [..] -- #f      ) <SKIP>
DROP             (      #f --         )

// decompiled
0 >              (     n 0 -- #f      )
[ "Hi" say       (      #f -- #f [..] )
]?               ( #f [..] -- #f      ) <SKIP>
!                (      #f -- #t      ) << invert the condition
[ "Goodbye" say  (      #t -- #t [..] )
]?               ( #t [..] -- #t      ) INVOKE!
DROP             (      #t --         )
```

## Conditional Loops
```
BEGIN
    1 - DUP 0 ==
UNTIL

// decompiled
[               (         n -- [..     )
    1 -         (         n -- n-1     ) << first entry
    DUP         (       n-1 -- n-1 n-1 )
    0 ==        ( n-1 n-1 0 -- n-1 #f  )
    !           (    n-1 #f -- n-1 #t  ) << invert the condition
]@?             (    n-1 #t -- n-1     ) CONDITIONAL LOOP

BEGIN
DUP
0 != WHILE
    1 -
REPEAT

// decompiled
[               (         n -- [..       )
    DUP         (         n -- n n       ) << first entry
    0 !=        (     n n 0 -- n #t      )
    [ 1 -       (      n #t -- n #t [..] )
    ]?          ( n #t [..] -- n-1 #t    ) INVOKE!
]@?             (    n-1 #t -- n-1       ) CONDITIONAL LOOP
```

## Counted Loops
```
10 0 DO
    1 +
LOOP

// decompiled
SWAP            (        n 10 0 -- n 0 10        ) (      )
[               (        n 0 10 -- n 0 10 [..    ) (      )
    >R          (        n 0 10 -- n 0           ) (   10 ) // turn into one built-in
    1 +         (           n 0 -- n 1           ) (   10 ) // turn into one built-in
    >R          (           n 1 -- n             ) ( 1 10 ) // turn into one built-in
    1 +         (             n -- n+1           ) ( 1 10 ) << loop body
    <R          (           n+1 -- n+1 1         ) (   10 ) // turn into one built-in
    <R          (           n+1 -- n+1 1 10      ) (      ) // turn into one built-in
    OVER OVER   (      n+1 1 10 -- n+1 1 10 1 10 ) (      ) // turn into one built-in
    >           ( n+1 1 10 1 10 -- n+1 1 10 #t   ) (      ) // turn into one built-in
]@?             (   n+1 1 10 #t -- n+1 1 10      ) (      )
```









