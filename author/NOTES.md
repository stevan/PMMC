
## Block Keywords

```
[             // start block and collect up until end token

]?            // if TOS if true, run this block
]@            // always run once, then if TOS if true, re-run this block

```

## Conditionals

```

0 > IF "Hi" say THEN

0 >            (     n 0 -- #t      )
[ "Hi" say     (      #t -- #t [..] )
]?             ( #t [..] -- #t      ) INVOKE!
DROP           (      #t --         )

0 > IF "Hi" say ELSE "Goodbye" say THEN

0 >              (     n 0 -- #t      )
[ "Hi" say       (      #t -- #t [..] )
]?               ( #t [..] -- #t      ) INVOKE!
!                (      #t -- #f      ) << invert the condition
[ "Goodbye" say  (      #t -- #t [..] )
]?               ( #t [..] -- #f      ) <SKIP>
DROP             (      #f --         )

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

[               (         n -- [..     )
    1 -         (         n -- n-1     ) << first entry
    DUP         (       n-1 -- n-1 n-1 )
    0 ==        ( n-1 n-1 0 -- n-1 #f  )
    !           (    n-1 #f -- n-1 #t  ) << invert the condition
]@              (    n-1 #t -- n-1     ) CONDITIONAL LOOP


BEGIN
DUP
0 != WHILE
    1 -
REPEAT

[               (         n -- [..       )
    DUP         (         n -- n n       ) << first entry
    0 !=        (     n n 0 -- n #t      )
    [ 1 -       (      n #t -- n #t [..] )
    ]?          ( n #t [..] -- n-1 #t    ) INVOKE!
]@              (    n-1 #t -- n-1       ) CONDITIONAL LOOP

```

## Counted Loops

```

10 0 DO
    1 +
LOOP

SWAP            (        n 10 0 -- n 0 10        ) (      )
[               (        n 0 10 -- n 0 10 [..    ) (      )
    >R          (        n 0 10 -- n 0           ) ( 10   )
    1 +         (           n 0 -- n 1           ) ( 10   )
    >R          (           n 1 -- n             ) ( 10 1 )
    1 +         (             n -- n+1           ) ( 10 1 ) << loop body
    <R          (           n+1 -- n+1 1         ) ( 10   )
    <R          (           n+1 -- n+1 1 10      ) (      )
    OVER OVER   (      n+1 1 10 -- n+1 1 10 1 10 ) (      )
    >           ( n+1 1 10 1 10 -- n+1 1 10 #t   ) (      )
]@              (   n+1 1 10 #t -- n+1 1 10      ) (      )


```














