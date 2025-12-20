import Image from 'next/image';

export default function AuthLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<main className='h-screen'>
			<div className='flex p-8 h-full w-full'>
				<div className='flex-2 h-full w-full bg-[url("/assets/images/illustration-authentication.svg")] bg-cover bg-no-repeat bg-position-[0%_50%] p-10 text-main flex flex-col justify-between rounded-2xl'>
					<Image
						src={'/assets/images/logo-large.svg'}
						alt='finance logo'
						width={200}
						height={40}
					/>

					<div className='bg-beige-500/20 backdrop-blur-xs p-8 rounded-xl flex flex-col gap-2'>
						<h2 className='text-3xl font-bold'>
							Keep track of your money and save for your future
						</h2>
						<p className='text-lg'>
							Personal finance app puts you in control of your spending. Track
							transactions, set budgets, and add to savings pots easily.
						</p>
					</div>
				</div>
				<div className='flex-3'>{children}</div>
			</div>
		</main>
	);
}
