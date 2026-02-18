import { ImageResponse } from 'next/og'

export const alt = 'Make the Change'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { locale: string } }) {
    const locale = params.locale
    const subtitle = {
        en: 'Invest in biodiversity',
        fr: 'Investissez dans la biodiversité',
        nl: 'Investeer in biodiversiteit',
    }[locale] || 'Invest in biodiversity'

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 80,
                        fontWeight: 'bold',
                        color: '#000000',
                    }}
                >
                    Make the Change
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: 20,
                        fontSize: 30,
                        color: '#666666',
                    }}
                >
                    {subtitle}
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
