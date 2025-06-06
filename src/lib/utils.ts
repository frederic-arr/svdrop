export type ReplaceAndPascalize<
	S extends string,
	T extends string
> = S extends `${infer A}${T}${infer B}`
	? `${Capitalize<A>}${ReplaceAndPascalize<B, T>}`
	: Capitalize<S>;

export type ReplaceAndCamelcase<
	S extends string,
	T extends string
> = S extends `${infer A}${T}${infer B}`
	? `${Lowercase<A>}${ReplaceAndPascalize<B, T>}`
	: Lowercase<S>;

export type ReplaceAndLowercase<
	S extends string,
	T extends string
> = S extends `${infer A}${T}${infer B}`
	? `${Lowercase<A>}${ReplaceAndLowercase<B, T>}`
	: Lowercase<S>;

export type ReplaceAndSnakecase<
	S extends string,
	T extends string
> = S extends `${infer A}${T}${infer B}`
	? `${Lowercase<A>}_${ReplaceAndSnakecase<B, T>}`
	: Lowercase<S>;

export type ReplaceAndScreamingcase<
	S extends string,
	T extends string
> = S extends `${infer A}${T}${infer B}`
	? `${Uppercase<A>}_${ReplaceAndScreamingcase<B, T>}`
	: Uppercase<S>;
