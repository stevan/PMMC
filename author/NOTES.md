












## Block Keywords

```
[             // start block and collect up until end token
  <block>
]?            // pop TOS, if true, run this block, put old TOS back on TOS
]@?           // always run once, then if TOS if true, re-run this block
]@+           // uses 2 numbers in the control stack to control iteration, may not run
]@            // raw block, runs forever, iteration is controlled with !NEXT and !LAST operations

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
]@?             (    n-1 #t -- n-1     ) CONDITIONAL LOOP


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
]@?             (    n-1 #t -- n-1       ) CONDITIONAL LOOP

```

## Counted Loops

```

10 0 DO
    1 +
LOOP

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

// alternately ...

SWAP            (        n 10 0 -- n 0 10   ) (      )
[               (        n 0 10 -- n [..    ) ( 1 10 )
    1 +         (             n -- n+1      ) ( 1 10 ) << loop body
]@+             (   n+1 1 10 #t -- n+1 1 10 ) (      )

```

## Raw Loops

```
1 
BEGIN
    1 + 
    DUP 2 % 0 != !NEXT
    DUP     9 == !LAST
END


1                            (      -- 1     )               
[                            (    1 -- 1 [.. ) << start of loop              
    1                        (    1 -- 1 1   )                       
    +                        (  1 1 -- 2     )                       
    DUP                      (    2 -- 2 2   )                                  
    2 % 0 ==                 (  2 2 -- 2 #t  )                                  
      !NEXT                  (    2 --       ) << Jumps to start of loop        
    DUP                      (    9 -- 9 9   ) << on last iteration ...
    9 ==                     (  9 9 -- 9 #t  )                                  
      !LAST                  ( 9 #t -- 9     ) << Jumps out of the loop here                         
]@                           (    9 -- 9     )                       


```












